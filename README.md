# Daphna Awadish postcards

B2B catalog for wholesale postcards and custom illustration quotes.

## Scripts

```bash
npm run catalog:parse
npm run catalog:upload
npm run dev
```

`catalog:parse` reads `DaphnaPostcardsCatalog.csv` and writes `public/data/postcards.json`. Pass an `.xlsx` path to read the first worksheet instead.

`catalog:upload` converts each `RawImagesPostcards/*.jfif` to a 1600px WebP and uploads that to Vercel Blob, then writes the public URL onto the matching postcard. It needs `BLOB_READ_WRITE_TOKEN` in `.env.local`.

## Email

Wholesale inquiries and custom quotes use Resend. Set these in `.env.local` before the forms can deliver mail:

- `RESEND_API_KEY`
- `INQUIRY_TO_EMAIL`
- `INQUIRY_FROM_EMAIL`
