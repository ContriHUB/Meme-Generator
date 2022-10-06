import React from "react";
import { useState, useEffect } from "react";

export default function Meme() {
	// Max size for canvas
	const MAX_HEIGHT = 700;
	const MAX_WIDTH = 450;

	// Get the canvas from document
	const canvas = document.getElementById("meme");
	
	const api_url = "https://api.imgflip.com/get_memes";
	//this is to store all the meme's url returned by the api
	const [allMemes, setAllMemes] = useState([]);
	
	//this function run only once on component load
	//when this component is mounted on page
	//it makes call to the api
	//and store the response in the state
	useEffect(function () {
		fetch(api_url)
			.then((data) => data.json())
			.then((data) => setAllMemes(data.data.memes))
			.catch((err) => 
				document.write("<center> <h3>Engine can't understand this code , it's invalid. please check code and reload page </h3> </center> ")			
			);
	}, []);

	//this state stores information about the current meme
	const [meme, setMeme] = useState({
		topText: "",
		bottomText: "",
		url: "",
	});

	function getRandomMeme() {
		let index = Math.floor(Math.random() * allMemes.length);
		setMeme((prev) => ({
			...prev,
			url: allMemes[index].url,
		}));
		updateMemeCanvas();
	}

	//this is for handling the reset functionality
	function handleReset() {
		setMeme({
			topText: "",
			bottomText: "",
			url: ""
		});
		updateMemeCanvas();
	}

	//this is to handle input change
	function handleInputChange(event) {
		const {name, value} = event.target;
		setMeme( (prevMeme) => ({
			...prevMeme,
			[name]: value
		}));
		updateMemeCanvas();
	}

	// this is for uploading the image from the PC
	function uploadImage(event){
		let fileURL = event.target.files[0];
		console.log(event.target.files[0].type);
		// accepts image in the form of PNG/JPG/JPEG
		if (event.target.files[0].type === "image/png" || event.target.files[0].type === "image/jpg" || event.target.files[0].type === "image/jpeg"){
			setMeme((prev) => ({
				...prev,
				url: URL.createObjectURL(fileURL)
			}))
			updateMemeCanvas();
			event.target.value = null;
		}
		else{
			// Alert is shown when there is incorrect file chosen
			alert("Please upload the image in the correct format (PNG/JPEG/JPG)!")
		}
	}

	// To download painted meme on canvas as png
	function saveMeme(){
		updateMemeCanvas();
		console.log(meme.url);
		console.log(meme.topText);
		console.log(meme.bottomText);
		// Creates a temporary <a></a> tag on button click to download the meme
		var link = document.createElement('a');
		link.download = 'meme.png';
		link.href = canvas.toDataURL();
		link.click();
	}

	// To update meme canvas
	function updateMemeCanvas() {

		// Set image from URL
		const image = new Image();
		image.src = meme.url;
		image.crossOrigin = 'Anonymous';
		const ctx = canvas.getContext("2d");

		// Sets the max dimension of the canvas
		canvas.width = Math.min(MAX_WIDTH,image.width);
		canvas.height = Math.min(MAX_HEIGHT,image.height);

		// Perform scaling on the image to fit the canvas
		var hRatio = canvas.width/image.width;
		var vRatio =  canvas.height/image.height;
		var ratio  = Math.min ( hRatio, vRatio );
		var centerShift_x = ( canvas.width - image.width*ratio ) / 2;
		var centerShift_y = ( canvas.height - image.height*ratio ) / 2;  
		ctx.clearRect(0,0,canvas.width, canvas.height);
		const fontSize = Math.floor(canvas.width / 10);
		const yOffset = canvas.height / 25;
	  
		// Update canvas background
		ctx.drawImage(image, 0,0, image.width, image.height, centerShift_x,centerShift_y,image.width*ratio, image.height*ratio);  
	  
		// Prepare text
		ctx.strokeStyle = "black";
		ctx.lineWidth = Math.floor(fontSize / 4);
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.lineJoin = "round";
		ctx.font = `${fontSize}px sans-serif`;
	  
		// Add top text
		ctx.textBaseline = "top";
		ctx.strokeText(meme.topText, canvas.width / 2, yOffset);
		ctx.fillText(meme.topText, canvas.width / 2, yOffset);
	  
		// Add bottom text
		ctx.textBaseline = "bottom";
		ctx.strokeText(meme.bottomText, canvas.width / 2, canvas.height - yOffset);
		ctx.fillText(meme.bottomText, canvas.width / 2, canvas.height - yOffset);
	}	  

	return (
		<div className="container">
			<div className="form">
				<input
					className="form__text"
					type="text"
					value={meme.topText}
					placeholder="text1"
					name="topText"
					onChange={handleInputChange}
					/>
				<input
					className="form__text"
					type="text"
					value={meme.bottomText}
					placeholder="text2"
					name="bottomText"
					onChange={handleInputChange}
				/>
				<button className="form__button" onClick={getRandomMeme}>
					Generate Meme
				</button>
				<label htmlFor="image-upload" className="form__button upload_image__button">
					Upload Meme Image
				</label>
				<input accept="image/*" id="image-upload" type="file" onChange={uploadImage} />
				<button className="form__button" onClick={handleReset}>
					Reset Meme
				</button>
				<button className="form__button" onClick={saveMeme}>
					Save Meme
				</button>
			</div>
			{/* This creates the preview of generated meme */}
			<div className="meme">
				{meme.url && <img className="meme__image" src={meme.url} alt="meme"/>}
				{meme.url && <h2 className="meme__text top">{meme.topText}</h2>}
				{meme.url && <h2 className="meme__text bottom">{meme.bottomText}</h2>}
			</div>
			{/* Creates a hidden canvas to paint image and draw text */}
			<p align="center" hidden={true}>
				<canvas id="meme">
				</canvas>
			</p>
		</div>
	);
}
