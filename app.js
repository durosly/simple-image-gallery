const galleryContainer = document.querySelector('.gallery-container');

//scope to load images on page load
{
	const xhr = new XMLHttpRequest();
	xhr.open("GET", "php/readImages.php?start=0");
	xhr.onreadystatechange = () => {
		if(xhr.readyState < 4) {
			console.log("loading");
		} else if(xhr.readyState === 4) {
			if(xhr.status === 200) {
				console.log(xhr.responseText);
			} else {
				console.log(xhr.status);
			}
		}

	}

	xhr.send();
}

//click event to open image modal
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

// upload and contact form transition scope
{
	//counter to keep track of currently displayed form
	let formStatus = 0;

	//forms to be transitted
	const uploadForm = document.querySelector('.upload-form');
	const messageForm = document.querySelector('.message-form');

	//action button for form transition
	const actionBtn = document.querySelector(".action");

	//function to transit between forms
	const transitForm = () => {
		switch(formStatus) {
			case 0:
				uploadForm.style.display = "none";
				messageForm.style.display = "block";
				actionBtn.textContent = "Upload image";
				formStatus = 1;
				break;

			case 1:
				uploadForm.style.display = "block";
				messageForm.style.display = "none";
				actionBtn.textContent = "Contact me";
				formStatus = 0;
				break;
			default: return;
		}
	};//end form transit function

	actionBtn.addEventListener('click', transitForm);

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




















