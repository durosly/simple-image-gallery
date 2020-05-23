//click event to open image modal
const galleryContainer = document.querySelector('.gallery-container');
galleryContainer.addEventListener('click', openImageModal);


const modal = document.querySelector('.image-modal');
function openImageModal(e) {
	const boxes = document.querySelectorAll('.box');

	boxes.forEach((box) => {
		if(box.contains(e.target)){
			const img = box.querySelector('img');

			const modalImage = modal.querySelector('img');
			modalImage.src = img.src;
			modal.style.display = 'flex';

		}
	})
}

//click event to close modal
const imageCloseBtn = document.querySelector('.image-modal .close');
imageCloseBtn.addEventListener('click', closeImageModal);
function closeImageModal(e) {
	modal.style.display = 'none';
}


//dispaly selected image name

// //input
// const imageInput = document.querySelector("#file");
// imageInput.addEventListener('change', setUploadImageName);

// function setUploadImageName(e) {
// 	document.querySelector('.image-name-preview').innerText =`selected: ${e.target.files[0].name}`;
// }

// // image submit handler

// const imageUploadForm = document.querySelector('.image-upload-form');
// imageUploadForm.addEventListener("submit", imageUploadHandler);

// function imageUploadHandler(e) {
// 	e.preventDefault();
// 	const filename = imageUploadForm.filename.value;
// 	const filedesc = imageUploadForm.filedesc.value;
// 	const filecredit = imageUploadForm.filecredit.value;
// 	// validate input using regex

// 	const formData = new FormData();
// 	formData.append("filename", imageUploadForm.filename.value);
// 	formData.append('filedesc', imageUploadForm.filedesc.value);
// 	formData.append('filecredit', imageUploadForm.filecredit.value);
// 	formData.append('file', imageUploadForm.file.files[0], imageUploadForm.filename.value);

// 	//sendData(formData);
// }

// //Validate function
// function validate(data, testType) {
// 	//Regular expressions
// 	const textOnly = /^[a-zA-Z]*/;

// 	switch(testType) {
// 		case 'textonly':
// 			return textOnly.test(data);
// 	}

// }

// // Send to a php script
// function sendData(formData) {
// 	const xhr = new XMLHttpRequest();

// }

// // script to swap form fields
// let current = "upload";
// const swapBtn = document.querySelector('.action');
// swapBtn.addEventListener("click", swap);

//forms 
// const up;

// function swap() {
// 	switch(current) {
// 		case "upload":

// 			break;
// 	}
// }




















