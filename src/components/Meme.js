import React from "react";
import { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
export default function Meme() {
	const api_url = "https://api.imgflip.com/get_memes";
	//this is to store all the meme's url returned by the api
	const [allMemes, setAllMemes] = useState([]);
	const [textInput, setTextInput] = useState("");
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
		text: [],
		url: "",
	});

	function getRandomMeme() {
		let index = Math.floor(Math.random() * allMemes.length);
		setMeme((prev) => ({
			...prev,
			url: allMemes[index].url,
		}));
	}
	const handleDelete = (i) => {
		setMeme((prev) => ({
			...prev,
			text: prev.text.filter((_, index) => index !== i),
		}));
	};
	//this is for handling the input
	function handleChange(event) {
		const { name, value } = event.target;

		setTextInput(value);
	}
	function handleTextSubmit(event) {
		event.preventDefault();
		setMeme((prev) => ({
			...prev,
			text: [...prev.text, textInput],
		}));
		setTextInput("");
	}
	//this is for handling the reset functionality
	function handleReset() {
		setMeme({
			text: [],
			url: "",
		});
	}

	// this is for uploading the image from the PC
	function uploadImage(event) {
		let fileURL = event.target.files[0];
		console.log(event.target.files[0].type);
		// accepts image in the form of PNG/JPG/JPEG
		if (
			event.target.files[0].type === "image/png" ||
			event.target.files[0].type === "image/jpg" ||
			event.target.files[0].type === "image/jpeg"
		) {
			setMeme((prev) => ({
				...prev,
				url: URL.createObjectURL(fileURL),
			}));
			event.target.value = null;
		} else {
			// Alert is shown when there is incorrect file chosen
			alert(
				"Please upload the image in the correct format (PNG/JPEG/JPG)!"
			);
		}
	}

	return (
		<div className="container">
			<form onSubmit={handleTextSubmit}>
				<div className="form">
					<input
						className="form__text"
						type="text"
						value={textInput}
						placeholder="text1"
						name="text"
						onChange={handleChange}
					/>
					<button type="submit" className="form__button">
						Add Text
					</button>

					<button className="form__button" onClick={getRandomMeme}>
						Generate Meme
					</button>
					<label
						for="image-upload"
						className="form__button upload_image__button"
					>
						Upload Meme Image
					</label>
					<input
						accept="image/*"
						id="image-upload"
						type="file"
						onChange={uploadImage}
					/>
					<button className="form__button" onClick={handleReset}>
						Reset Meme
					</button>
				</div>
			</form>
			<div className="meme">
				{meme.url && (
					<img className="meme__image" src={meme.url} alt="meme" />
				)}
				{meme.text.map(
					(t, i) =>
						meme.url && (
							<h2 className="meme__text" key={i}>
								{t}
								<IoIosCloseCircle
									className="meme__text__close"
									onClick={() => handleDelete(i)}
								/>
							</h2>
						)
				)}
			</div>
		</div>
	);
}
