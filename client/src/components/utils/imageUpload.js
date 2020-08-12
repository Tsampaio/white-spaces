const onSelectFile = e => {
	if (e.target.files && e.target.files.length > 0) {
		const reader = new FileReader();
		reader.addEventListener('load', () =>
			setCropState({
				...cropState,
				src: reader.result
			})
		);
		reader.readAsDataURL(e.target.files[0]);
	}
};

const onImageLoaded = async image => {
	console.log(image);
	imageRef.current = image;

};

const onCropComplete = crop => {
	makeClientCrop(crop);
};

const onCropChange = (crop, percentCrop) => {
	// You could also use percentCrop:
	console.log("inside onCropChange");
	setCropState({
		...cropState,
		crop
	});
};

const makeClientCrop = async (crop) => {
	console.log(imageRef.current);
	if (imageRef.current && crop.width && crop.height) {
		const croppedImageUrl = await getCroppedImg(
			imageRef.current,
			crop,
			'newFile.jpeg'
		);
		console.log(croppedImageUrl);
		setCropState({
			...cropState,
			croppedImageUrl: croppedImageUrl
		});
	}
}

const getCroppedImg = (image, crop, fileName) => {
	console.log(image);
	console.log(crop);
	const canvas = document.createElement('canvas');
	const scaleX = image.naturalWidth / image.width;
	const scaleY = image.naturalHeight / image.height;
	canvas.width = crop.width;
	canvas.height = crop.height;
	const ctx = canvas.getContext('2d');

	ctx.drawImage(
		image,
		crop.x * scaleX,
		crop.y * scaleY,
		crop.width * scaleX,
		crop.height * scaleY,
		0,
		0,
		crop.width,
		crop.height
	);
	const reader = new FileReader()
	canvas.toBlob(blob => {
		reader.readAsDataURL(blob)
		reader.onloadend = () => {
			dataURLtoFile(reader.result, `${auth.user._id}.jpg`);
		}
	})

}

const dataURLtoFile = (dataurl, filename) => {
	let arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	let croppedImage = new File([u8arr], filename, { type: mime });
	setCropState({
		...cropState,
		croppedImage: croppedImage
	})
}

const handleSubmit = async (e) => {

	e.preventDefault();

	const config = {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	}

	const formData = new FormData();
	formData.append('file', cropState.croppedImage);

	const res = await axios.post("/api/users/profilePic", formData, config);
	console.log("res.data");
	console.log(res.data);
}
