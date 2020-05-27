const galleryContainer = document.querySelector('.gallery-container');
const loadMoreBtn = document.getElementById("load-more");

let imageCounter = 0;

function loadContent(data) {
	data.forEach((item) => {
		const box = document.createElement("div");
		box.classList.add("box");
		
		// image div
		const imageContainer = document.createElement('div');
		imageContainer.classList.add("image-container");
		imageContainer.setAttribute("id", item.id);
		//image
		const img = document.createElement('img');
		img.classList.add("loader");
		img.setAttribute("src", "svg/camera-fade.svg");

		//insert image into image container
		imageContainer.appendChild(img);

		//details div
		const details = document.createElement("div");
		details.classList.add("details");
		const detailsContent = `
			<h4>${item.name}</h4>
			<h5>${item.credit}</h5>
			<p title="Date uploaded"><i class="fas fa-calendar-alt"></i> <span>${item.date}.</span></p>
			<p title="Time uploaded"><i class="fas fa-clock"></i> <span>${item.time} GMT +1</span></p>
		`;
		details.innerHTML = detailsContent;
		//append all to box div
		box.appendChild(imageContainer);
		box.appendChild(details);

		//insert into dom
		galleryContainer.appendChild(box);

		//Load image
		imageLoader(item.filename, item.id, item.name);

	}); //end for each loop
	

	//increment image counter for next request
	imageCounter = data.length - 1;
} // end of loadContent function

//image loader function
function imageLoader(src, id, name) {
	//DOM image
	const img = document.createElement('img');
	img.classList.add("image");
	img.setAttribute("alt", name);
	img.setAttribute("data-id", id);
	// on load insert to DOM
	img.onload = () => {
		const container = document.getElementById(id);
		container.innerHTML = "";
		container.appendChild(img);

	}

	img.src = `images/${src}`;

} // end image loader function

//function to load images on page load
function requestImages(){
	const xhr = new XMLHttpRequest();
	xhr.open("GET", `php/readImages.php?start=${imageCounter}`, true);
	xhr.onreadystatechange = () => {
		if(xhr.readyState < 4) {
			console.log("loading");
		} else if(xhr.readyState === 4) {
			if(xhr.status === 200) {
				const json = JSON.parse(xhr.responseText);
				loadContent(json);
				// console.log(xhr.responseText);
			} else {
				console.log(xhr.status);
			}
		}

	}

	xhr.send();
} //end of requestimages function

//load images on DOM load
document.addEventListener("DOMContentLoaded", requestImages);

//load more images on 
loadMoreBtn.addEventListener("click", requestImages);



//click event to open image modal
galleryContainer.addEventListener('click', openImageModal);


const modal = document.querySelector('.image-modal');
function openImageModal(e) {
	const boxes = document.querySelectorAll('.box');

	boxes.forEach((box) => {
		if(box.contains(e.target)){
			//get image in clicked box div
			const img = box.querySelector('img');
			//get id of image
			const id = img.dataset.id;

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




















