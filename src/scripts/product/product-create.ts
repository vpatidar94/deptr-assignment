import { Attribute, LocalizedString, Money, PriceDraft, ProductDraft, ProductVariantDraft } from "@commercetools/platform-sdk";
import { transformAmountToCentAmount } from "../order/helpers/helper";

console.log(productCreate('{"publish":"true","translations":[{"region":"en","product_name":"Test product","search_key":"test-product"},{"region":"nl-NL","product_name":"Test product","search_key":"test-product"}],"date":"2017-01-01","variants":[{"stock_unit":"UUDDHE XX OOOOOOOOI","prices":{"USD":[{"country":"DEFAULT","amount":"100.00","currency":"$"},{"country":"DEFAULT","amount":"200.00","currency":"$"},{"country":"US","amount":"90.00","currency":"$"}],"EUR":[{"country":"DEFAULT","amount":"100.00","currency":"EUR"}]}}]}'));

export function productCreate(json: string): ProductDraft {
    const productObj = JSON.parse(json);
    return transformProduct(productObj);
}

function transformProduct(product: any): ProductDraft {

    const name = product.translations.reduce((acc: LocalizedString, translation: any) => {
        acc[translation.region] = translation.product_name;
        return acc;
    }, {});

    const slug = product.translations.reduce((acc: LocalizedString, translation: any) => {
        acc[translation.region] = translation.search_key;
        return acc;
    }, {});

    const localProduct: ProductDraft = {
        productType: {
            typeId: "product-type",
            id: "test-id",
        },
        publish: Boolean(product.publish),
        name,
        slug,
        masterVariant: getMasterVariant(product.variants[0], product.date)
    } as ProductDraft;


    return localProduct;
}

export function getMasterVariant(variant: any, date: string): ProductVariantDraft {
    return {
        sku: setSKU(variant.stock_unit),
        prices: setPrices(variant.prices),
        attributes: [{
            name: 'created_at',
            value: (date ? new Date(date) : new Date)
                .toISOString()
                .replace(/T/, ' ')
                .replace(/\..+/, ''),
        } as Attribute]
    } as ProductVariantDraft;
}


/**
 * DO NOT DELETE
 * Function to set the sku of a product
 * @param sku Original sku of an incoming object 
 * @returns The sku of the product for the commercetools platform
 */
export function setSKU(sku: string): string {
    let skuFormated = '';
    // UUDDHE XX OOOOOOOOI
    const list = sku.toUpperCase().split(' ');
    list.forEach((item: string, index: number) => {
        const letterList = [...item];
        const uniqueLetterList = [... new Set(letterList)]
        const counterObj = getLetterCountInWord(letterList);
        skuFormated += uniqueLetterList.reduce((acc: string, letter: string) => {
            return `${acc}${counterObj[letter]}${letter}`;
        }, '');
        if (index !== list.length - 1) {
            skuFormated += '-';
        }
    });
    return skuFormated;
}

export function getLetterCountInWord(wordList: string[]): { [key: string]: number } {
    const counterObj = {} as { [key: string]: number };
    wordList.forEach((letter: string) => {
        if (!counterObj[letter]) {
            counterObj[letter] = 1;
        } else {
            counterObj[letter]++;
        }
    });
    return counterObj;
}

/**
 * DO NOT DELETE
 * Function to set the prices of a product
 * @param prices Pricing object of an incoming object
 * @returns Returns a priceDraft object for the commercetools platform
 */
export function setPrices(prices: any): PriceDraft[] {
    let priceDrafts: PriceDraft[] = [];
    const keys = Object.keys(prices);
    keys.forEach((currencyCode: string) => {

        const dto = {} as any;
        prices[currencyCode].forEach((currencyDetail: any) => {
            const centAmount = transformAmountToCentAmount(currencyDetail.amount);
            const key = `${currencyDetail.country}`
            if (!dto[key]) {
                dto[key] = {
                    value: {
                        centAmount: centAmount,
                        currencyCode: currencyDetail.currency
                    },
                    country: currencyDetail.country
                }
            }
            if (centAmount < dto[key].value.centAmount) {
                dto[key].value.centAmount = centAmount;
            }
        });
        priceDrafts = [...priceDrafts, ...Object.values(dto)] as PriceDraft[];
    });
    return priceDrafts;
}
