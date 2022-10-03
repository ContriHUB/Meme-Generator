import React from "react";
import { useState, useEffect } from "react";
import  '../custom.css';

export default function Meme() {
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
			.then((data) => setAllMemes(data.data.memes));
	}, []);

	//this state stores information about the current meme
	const [meme, setMeme] = useState({
		topText: "",
		bottomText: "",
		url: "",
		width:"",
		rotate:"",
	});

	function getRandomMeme() {
		let index = Math.floor(Math.random() * allMemes.length);
		setMeme((prev) => ({
			...prev,
			url: allMemes[index].url,
		}));
	}

	//this is for handling the input
	function handleChange(event) {
		const { name, value } = event.target;
		setMeme((prevMeme) => ({
			...prevMeme,
			[name]: value,
		}));
	}

	//this is for handling the reset functionality
	function handleReset() {
		setMeme({
			topText: "",
			bottomText: "",
			url: "",
			width:"",
		});
	}

	//this is to handle input change
	function handleInput1Change(event) {
		setMeme( (prevMeme) => ({
			...prevMeme,
			topText: event.target.value
		}));
	}
	function handleInput2Change(event) {
		setMeme( (prevMeme) => ({
			...prevMeme,
			bottomText: event.target.value
		}));
	}

	function widthChange(event) {
		setMeme((prevMeme) => ({
			...prevMeme,
			width: event.target.value
		}));
		console.log(event.target.value);
	}

	function rotateChange(event) {
		setMeme((prevMeme) => ({
			...prevMeme,
			rotate: event.target.value,
		}));
		console.log(event.target.value);
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
			event.target.value = null;
		}
		else{
			// Alert is shown when there is incorrect file chosen
			alert("Please upload the image in the correct format (PNG/JPEG/JPG)!")
		}
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
					onChange={handleInput1Change}
					/>
				<input
					className="form__text"
					type="text"
					value={meme.bottomText}
					placeholder="text2"
					name="bottomText"
					onChange={handleInput2Change}
				/>

                <input
					className="form__text"
					type="number"
					value={meme.width}
					placeholder="Width"
					name="width"
					onChange={widthChange}
				/>

                <input
					className="form__text"
					type="text"
					value={meme.rotate}
					placeholder="rotate"
					name="rotate"
					onChange={rotateChange}
				/>

				<button className="form__button" onClick={getRandomMeme}>
					Generate Meme
				</button>
				<label for="image-upload" className="form__button upload_image__button">
					Upload Meme Image
				</label>
				<input accept="image/*" id="image-upload" type="file" onChange={uploadImage} />
				<button className="form__button" onClick={handleReset}>
					Reset Meme
				</button>
			</div>
			<div className="meme">
				{meme.url && <img className="meme__image" src={meme.url} alt="meme"/>}
				{meme.url && <p className="meme__text top" style={{fontSize:meme.width , transform: "translateX(50%) translateY(50%) rotate("+meme.rotate+"deg)"}}>{meme.topText}</p>}
				{meme.url && <p className="meme__text bottom" style={{fontSize:meme.width , transform: "translateX(50%) translateY(50%) rotate("+meme.rotate+"deg)"}}>{meme.bottomText}</p>}
			</div>
		</div>
	);
}
