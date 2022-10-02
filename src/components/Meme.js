import React from "react";
import { useState, useEffect } from "react";

export default function Meme() {
	const api_url = "https://api.imgflip.com/get_memes";
	//this is to store all the meme's url returned by the api
	const [allMemes, setAllMemes] = useState([]); // this is to store the meme's url returned by the api
	const [memeText, setMemeText] = useState(["", ""]); // this is to store the text entered by the user
	const MemeTextElements = [];

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

	// Here we are creating text boxes
	for (let i = 0; i < memeText.length; i++) {
		MemeTextElements.push(
			<div
				className='form__text-container'
				key={i}>
				<input
					className="form__text"
					type="text"
					value={memeText[i]}
					// onChange={handleChange}
					placeholder={`Enter Text ${i + 1}`}
					onChange={(e) => {
						setMemeText(
							memeText.map((text, index) => (index === i ? e.target.value : text))
						)
					}}
				/>

				{/* svg for delete button, deleting them is allowed */}
				{i >= 2 && (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='delete__svg--allowed'
						fill='none'
						viewBox='0 0 24 24'
						stroke='white'
						onClick={(e) => {
							// Delete the text
							setMemeText(memeText.filter((text, index) => index !== i))
						}}>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
						/>
					</svg>
				)}
				{/* svg for delete button, deleting them is not allowed */}
				{i < 2 && (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='delete__svg--not-allowed'
						viewBox='268 160 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							stroke='#fff'
							fillRule='nonzero'
							fill='none'
							d='M 285.876 165.87 L 285.009 178.012 C 284.934 179.059 284.063 179.87 283.014 179.87 L 274.738 179.87 C 273.688 179.87 272.817 179.059 272.743 178.012 L 271.876 165.87 M 276.876 169.87 L 276.876 175.87 M 280.876 169.87 L 280.876 175.87 M 281.876 165.87 L 281.876 162.87 C 281.876 162.318 281.428 161.87 280.876 161.87 L 276.876 161.87 C 276.324 161.87 275.876 162.318 275.876 162.87 L 275.876 165.87 M 270.876 165.87 L 286.876 165.87'
						/>
						<line
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							stroke='#fff'
							fill='rgb(255, 200, 67)'
							x1='270.717'
							y1='180.3'
							x2='287.616'
							y2='163.065'
						/>
					</svg>
				)}
			</div>
		)
	}

	return (
		<div className="container">
			<div className="form">
				{MemeTextElements}
				<button
					className='form__button--secondary'
					onClick={() => {
						setMemeText([...memeText, ""])
					}}>
					Add Text Block Here
				</button>
				<button className="form__button" onClick={getRandomMeme}>
					Generate Meme
				</button>
			</div>
			<div className="meme">
				{meme.url && <img className="meme__image" src={meme.url} />}
				{meme.url && memeText.map((text, index) => (
					<h2 className="meme__text" key={index} >
						{text}
					</h2>
				))}
			</div>
		</div>
	);
}
