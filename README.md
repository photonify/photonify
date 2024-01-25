# Photonify

Photonify is a utility to manage image uploads and automatically process them into fingerprinted files. The plugin also supports S3 uploads.

## Installation

#### NPM

```bash
npm install photonify
```

#### Yarn

```bash
yarn add photonify
```

## Usage

- Photonify has a method called "processFiles" that will create four resized photos for you by default. The arguments passed to this method will differ slightly depending on filesystem vs. S3 storage.
- Both examples are below:

#### S3 Storage:

Parameters:

- storage: _String - Required_
- s3Config: _any - Required_ [details here](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/)
- s3Bucket: _String - Required_
- outputFormat: _String_

Example:

```javascript
const imageBuffer = req.file.buffer;

const result = await photonify.processFiles([imageBuffer], {
  storage: "s3",
  s3Config: {
    region: "us-west-1",
  },
  s3Bucket: "photonify",
});
```

#### Filesystem Storage:

Parameters:

- outputDest: _String - Required_
- outputFormat: _String_
- sizes: _String_

Example with Custom Sizes:

```javascript
const imageBuffer = req.file.buffer;

const result = await photonify.processFiles([imageBuffer], {
  outputDest: path.join(__dirname, "resized_images"),
  sizes: {
    lg: {
      width: 500,
      height: 250,
    },
    md: {
      width: 250,
      height: 125,
    },
  },
});
```

## Removing Files

- Photonify has support for removing files from S3
- Note: No support for local filesystem removal is added to Photonify. You are encouraged instead to use the built-in fs.unlink command instead.

#### Removing S3 Files:

Parameters:

- storage: _String - Required_
- s3Config: _any - Required_ [details here](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/)
- s3Bucket: _String - Required_

Example:

```javascript
await photonify.remove("somefile.jpg", {
  storage: "s3",
  s3Config: {
    region: "us-west-1",
  },
  s3Bucket: "photonify",
});
```

## Example App

- You can see a working example application that uses Express JS [here](https://github.com/photonify/photonify-express-example).
- This example uses the [Multer](https://github.com/expressjs/multer) plugin to access multipart file data.
