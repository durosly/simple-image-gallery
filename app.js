const galleryContainer = document.querySelector('.gallery-container');
const loadMoreBtn = document.getElementById("load-more");


let imageCounter = 0;

//function to create preloader image
function createLoader(type) {
	const img = document.createElement('img');
	img.classList.add("loader");
	img.setAttribute("src", `svg/camera-${type}.svg`);

	return img
}
 
function loadContent(data) {
	data.forEach((item) => {
		const box = document.createElement("div");
		box.classList.add("box");
		
		// image div
		const imageContainer = document.createElement('div');
		imageContainer.classList.add("image-container");
		imageContainer.setAttribute("id", item.id);
		//image
		const img = createLoader("fade");

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
	imageCounter = data.length;
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

//function to disable loadMoreBtn
function disableLoadMoreBtn() {
	//disable load more btn
	loadMoreBtn.disabled = true;
	loadMoreBtn.textContent = "Loading...";
}

//function to enable loadMoreBtn
function enableLoadMoreBtn() {
	//enable load more btn
	loadMoreBtn.disabled = false;
	loadMoreBtn.textContent = "See more...";	
}

//function to load images on page load
function requestImages(){
	const xhr = new XMLHttpRequest();
	xhr.open("GET", `php/readImages.php?start=${imageCounter}`, true);
	//disable load more btn
	disableLoadMoreBtn();

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

			//enable load more btn
			enableLoadMoreBtn();
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
const modalDesc = document.querySelector('.modal-info');
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
			getDescription(id);
		}
	})
}

//function to load description to the DOM
function loadDescription(data) {
	const html = `
		<h4 class="modal-image-name">${data.name}</h4>
		<p class="modal-image-desc">${data.description}</p>
	`;

	modalDesc.innerHTML = html;
}

//function to handle error on loading of description
function loadDescriptionError() {
	modalDesc.innerHTML = "<p style='color: red;'><i class='fas fa-exclamation-triangle'></i> Something went wrong. <br />Could not load image description.</p>"
}

//function to get image description from database
function getDescription(id) {
	const xhr = new XMLHttpRequest();
	xhr.open("GET", `php/readDescription.php?id=${id}`, true);
	modalDesc.innerHTML = "";
	modalDesc.appendChild(createLoader("spin"));
	xhr.onreadystatechange = () => {
		if(xhr.readyState === 4) {
			if(xhr.status === 200) {
				loadDescription(JSON.parse(xhr.responseText));
			} else {
				loadDescriptionError();
			}
		}
	}

	xhr.send();
}

//click event to close modal
const imageCloseBtn = document.querySelector('.image-modal .close');
imageCloseBtn.addEventListener('click', closeImageModal);
function closeImageModal(e) {
	modal.style.display = 'none';
}


/***********************************************
* upload and contact form transition 			*
* and submission handling scope					*
*												*
***********************************************/
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

	//event listener for on submit of upload form
	uploadForm.addEventListener("submit", uploadFormHandler);

	/****************************
	*	upload form handler 	*
	*****************************/
	//upload form handler
	function uploadFormHandler(e) {
		e.preventDefault();
		//serialize form data
		const data = new FormData();

		//gather form data
		data.append("filename", uploadForm.filename.value);
		data.append("filedesc", uploadForm.filedesc.value);
		data.append("filecredit", uploadForm.filecredit.value);
		data.append("file", uploadForm.file.files[0]);

		//send form data
		sendUploadData(data);
	}

	//display selected file name
	const displayFilename = document.querySelector('.image-name-preview');
	uploadForm.file.addEventListener("change", () => {
		displayFilename.textContent = uploadForm.file.files[0].name;
	})

	//function to disable upload form submit btn
	function disableUploadFormSubmitBtn(form) {
		form.querySelector(".submit-btn").disabled = true;
	}

	//function to enable upload form submit btn
	function enableUploadFormSubmitBtn(form) {
		form.querySelector(".submit-btn").disabled = false;
	}

	//function to display form overlay
	function displayOverlay(form) {
		form.querySelector('.form-progress-overlay').style.display = 'flex';
	}

	//function to hide form overlay
	function hideOverlay(form) {
		form.querySelector('.form-progress-overlay').style.display = 'none';
	}

	//show overlay spinner
	function showOverlaySpinner(form) {
		form.querySelector('.loading').style.display = 'block';
	}

	//hide overlay spinner
	function hideOverlaySpinner(form) {
		form.querySelector('.loading').style.display = 'none';
	}

	//show progress bar
	function showProgressBar(form) {
		form.querySelector('.progress-container').style.display = 'block';
	}

	//hide progress bar
	function hideProgressBar(form) {
		form.querySelector('.progress-container').style.display = 'none';
	}

	//clear upload form fields
	function clearUploadFields() {
		uploadForm.filename.value = "";
		uploadForm.filedesc.value = "";
		uploadForm.filecredit.value = "";
		uploadForm.file.files[0] = "";
	}

	//function to update progress
	function updateProgress(form, progress) {
		const bar = form.querySelector('.progress-bar');
		bar.style.width = `${progress}%`;

		//bad code [improve this]
		if(progress === 100) {
			bar.textContent = "Upload Success";
			bar.parentElement.classList.add("success");
			setTimeout(() => {
				bar.textContent = "";
				bar.parentElement.classList.remove("success");
			}, 5000);
		}
	}

	//function to send form data
	function sendUploadData(data) {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", 'php/uploadImage.php', true);
		//disable upload btn
		disableUploadFormSubmitBtn(uploadForm);
		//xhr.setRequestHeader("Content-Type", "multipart/form-data");
		displayOverlay(uploadForm);
		showProgressBar(uploadForm);

		xhr.upload.onprogress = (e) => {
			const progress = e.lengthComputable ? Math.round((e.loaded / e.total) * 100) : 0;
			if(progress >= 7) {
				updateProgress(uploadForm, progress);
			}	
		}
		xhr.onload = () => {
			enableUploadFormSubmitBtn(uploadForm);
			clearUploadFields();
			setTimeout(() => {
				hideOverlay(uploadForm);
			}, 4500);
		}

		xhr.onerror = () => {
			enableUploadFormSubmitBtn(uploadForm);
			bar.textContent = "Upload Failed";
			bar.parentElement.classList.add("fail");
			setTimeout(() => {
				bar.textContent = "";
				bar.parentElement.classList.remove("fail");
			}, 5000);
			setTimeout(() => {
				hideOverlay(uploadForm);
			}, 4500);
		}

		xhr.send(data);
	} //end upload form handler




	/*************************************
	*									 *
	*	begin message form handler 		 *
	*									 *
	**************************************/

	messageForm.addEventListener("submit", messageFormHandler);

	function messageFormHandler(e) {
		e.preventDefault();

		const data = new FormData(messageForm);
		displayOverlay(messageForm);

		sendMessageHandler(data);
	}

	function clearMessageFields() {
		messageForm.email.value = "";
		messageForm.message.value = "";
	}

	function showMessageNotice(status, response) {
		const notice = document.querySelector('.msg-notification');
		const elem = document.createElement('h3');
		hideOverlaySpinner(messageForm);
		if(status === 200) {
			elem.style.color = "#7ebc59";
			elem.innerText = response.message;
			notice.appendChild(elem);
			clearMessageFields();
		} else {
			elem.style.color = 'red';
			elem.innerText = response.message;
			notice.appendChild(elem);
		}

		setTimeout(() => {
			notice.removeChild(elem);
		}, 5000);
	}

	function sendMessageHandler(data) {
		const xhr = new XMLHttpRequest();

		xhr.open("POST", "php/message.php", true);

		xhr.onload = () => {
			setTimeout(() => {
				hideOverlay(messageForm);
			}, 5000);
			
			if(xhr.status === 200) {
				showMessageNotice(xhr.status, JSON.parse(xhr.responseText));
			} else {
				showMessageNotice(xhr.status, {message: xhr.statusText});
			}
			
		}

		xhr.onerror = () => {
			const notice = document.querySelector('.msg-notification');
			const elem = document.createElement('h3');
			hideOverlaySpinner(messageForm);

			elem.style.color = 'red';
			elem.innerText = "Something went wrong.";
			notice.appendChild(elem);

			setTimeout(() => {
				notice.removeChild(elem);
			}, 5000);
		}

		xhr.send(data);
	}


}//end upload and contact form scope


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




















