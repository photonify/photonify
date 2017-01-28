# Photonify

Photonify is a utility to manage multipart image uploads and automatically process them with Imagemagick. The plugin also supports S3 uploads.

## Installation

```bash
npm install photonify
```

## Usage

- Photonify has a method called "process" that will create three resized photos for you. The arguments passed to this method will differ slightly depending on filesystem vs. S3 storage.
- Both examples are below:

#### S3 Storage:

Parameters:

- data: *Buffer - Required*
- fileName: *String - Required*
- fingerprint: *Boolean*
- storage: *String*

Example:

```javascript
const params = {
	data: req.files.photo.data,
	fileName: req.files.photo.name,
	fingerprint: true,
	storage: "s3"
};

photonify.process(params, (images) => {
	res.status(201).json(images);
});
```

#### Filesystem Storage:

Parameters:

- data: *Buffer - Required*
- fileName: *String - Required*
- dest: *String - Required*
- fingerprint: *Boolean*
- storage: *String*

Example:

```javascript
const params = {
	data: req.files.photo.data,
	fileName: req.files.photo.name,
	dest: "./public/images",
	fingerprint: true,
	storage: "filesystem"
};

photonify.process(params, (images) => {
	res.status(201).json(images);
});
```

## Using S3

- Note: If you want to use S3 the plugin makes the assumption that you have the following three environment variables set up:

```javascript
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_BUCKET_NAME
```

- You can read more about getting these values from the [AWS access keys documentation](http://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html).
- A good plugin for setting up these environment variables is called [dotenv](https://www.npmjs.com/package/dotenv).

## Removing Files

- Photonify has support for removing files from the filesystem or S3 as well.

#### Removing S3 Files:

Parameters:

- keys: *Array - Required*
- storage: *String - Required*

Example:

```javascript
photonify.remove({
	keys: [photo.photo_large_key, photo.photo_medium_key, photo.photo_small_key],
	storage: "s3"
}, (result) => {
	photo
	.destroy()
	.then(() => {
		res.sendStatus(200);
	})
	.catch((err) => {
		res
		.status(400)
		.json(err);
	});
});
```

#### Removing Filesystem Files:

Parameters:

- keys: *Array - Required*
- storage: *String - Required*
- source: *String - Required*

Example:

```javascript
photonify.remove({
	keys: [photo.photo_large_key, photo.photo_medium_key, photo.photo_small_key],
	storage: "filesystem",
	source: __dirname + "/images"
}, (result) => {
	photo
	.destroy()
	.then(() => {
		res.sendStatus(200);
	})
	.catch((err) => {
		res
		.status(400)
		.json(err);
	});
});
```

## Example App

- You can see a working example application that uses express [here](express-example/).
- This example uses the [express-fileupload](https://www.npmjs.com/package/express-fileupload) plugin to access multipart file data.