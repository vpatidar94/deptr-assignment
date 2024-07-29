import { getLetterCountInWord, getMasterVariant, productCreate, setPrices, setSKU } from '../../src/scripts/product/product-create'; // Replace with the actual path

const json = '{"publish":"true","translations":[{"region":"en","product_name":"Test product","search_key":"test-product"},{"region":"nl-NL","product_name":"Test product","search_key":"test-product"}],"date":"2017-01-01","variants":[{"stock_unit":"UUDDHE XX OOOOOOOOI","prices":{"USD":[{"country":"DEFAULT","amount":"100.00","currency":"$"},{"country":"DEFAULT","amount":"200.00","currency":"$"},{"country":"US","amount":"90.00","currency":"$"}],"EUR":[{"country":"DEFAULT","amount":"100.00","currency":"EUR"}]}}]}';

describe("Product create test suite", () => {

    it('should format SKU correctly', () => {
        const testCases = [
            { input: 'UUDDHE XX OOOOOOOOI', expected: '2U2D1H1E-2X-8O1I' },
            { input: 'ABC DEF GHI', expected: '1A1B1C-1D1E1F-1G1H1I' },
            { input: 'AABBCC', expected: '2A2B2C' },
            { input: 'aaa BBB ccc', expected: '3A-3B-3C' },
            { input: 'MiXeD CaSe', expected: '1M1I1X1E1D-1C1A1S1E' },
        ];

        testCases.forEach(({ input, expected }) => {
            expect(setSKU(input)).toBe(expected);
        });
    });

    it('should create a product from JSON string ProductDraft', () => {
        const result = productCreate(json);
        expect(result).toHaveProperty('productType');
        expect(result).toHaveProperty('publish', true);
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('slug');
        expect(result).toHaveProperty('masterVariant');
    });

    it('should return current date if null is passed for date', () => {
        const object = JSON.parse(json);
        const result = getMasterVariant(object.variants[0], '');
        expect(result).toHaveProperty('sku', '2U2D1H1E-2X-8O1I');
        expect(result).toHaveProperty('prices');
        expect(result).toHaveProperty('attributes');
        const createdAtAttribute = result.attributes?.[0];
        expect(createdAtAttribute).toHaveProperty('name', 'created_at');
        expect(createdAtAttribute).toHaveProperty('value');
    });

    it('should return ProductVariantDraft on calling getMasterVariant', () => {
        const object = JSON.parse(json);
        const result = getMasterVariant(object.variants[0], '');
        expect(result).toHaveProperty('sku', '2U2D1H1E-2X-8O1I');
        expect(result).toHaveProperty('prices');
        expect(result.attributes).toHaveLength(1);
        expect(result).toHaveProperty('attributes');
        const createdAtAttribute = result.attributes?.[0];
        expect(createdAtAttribute).toHaveProperty('name', 'created_at');
        expect(createdAtAttribute).toHaveProperty('value');
    });

    it('should return object of count for each char', () => {
        const result = getLetterCountInWord(['A', 'B', 'C', 'B', 'E', 'F', 'C', 'M']);
        const expected = {
            A: 1,
            B: 2,
            C: 2,
            E: 1,
            F: 1,
            M: 1
        };
        expect(result).toEqual(expected);
    });

    it('function setPrices should return setPrices', () => {
        const prices = {
            USD: [
                { country: 'DEFAULT', amount: '100.00', currency: '$' },
                { country: 'US', amount: '90.00', currency: '$' },
                { country: 'US', amount: '80.00', currency: '$' }

            ],
            EUR: [
                { country: 'DEFAULT', amount: '100.00', currency: 'EUR' }
            ]
        };
        const result = setPrices(prices);
        expect(result).toHaveLength(3);
        expect(result[0]).toHaveProperty('value.centAmount', 10000);
        expect(result[1]).toHaveProperty('value.centAmount', 8000);
        expect(result[2]).toHaveProperty('value.centAmount', 10000);
    });

});