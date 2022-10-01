import React from "react";
import { useState, useEffect } from "react";

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
	//this is for clearing content
	function clearHandler() {
		setMeme({
			topText: "",
			bottomText: "",
			url: "",
		});
	}
	return (
		<div className="container">
			<div className="form">
				<input
					className="form__text"
					type="text"
					placeholder="text1"
					name="topText"
					value={meme.topText}
					onChange={handleChange}
				/>
				<input
					className="form__text"
					type="text"
					placeholder="text2"
					name="bottomText"
					value={meme.bottomText}
					onChange={handleChange}
				/>
				<button className="form__button" onClick={getRandomMeme}>
					Generate Meme
				</button>
				<button className="form__button" onClick={clearHandler}>
					Clear
				</button>
			</div>
			<div className="meme">
				{meme.url && <img className="meme__image" src={meme.url} />}
				{meme.url && <h2 className="meme__text">{meme.topText}</h2>}
				{meme.url && <h2 className="meme__text">{meme.bottomText}</h2>}
			</div>
		</div>
	);
}
