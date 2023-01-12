import { useState, useEffect } from 'react'

import './App.css';
import ToggleSlider from './components/ToggleSlider';
import BookTile from './components/BookTile';
import SearchComponent from './components/SearchComponent';
import PaginationButtons from './components/PaginationButtons';

import 'bootstrap/dist/css/bootstrap.min.css';
import Tooltip from './components/test';
import InfoBox from './components/InfoBox';

const API_URL = 'http://localhost:5000';
let bookSearchEles = [];

function mapBookObjectToBookTile(bookObject, infoCardState, setInfoCardState) {
	return <BookTile
		key={bookObject['_id']}
		bookObject={bookObject}
		infoCardState={infoCardState}
		handleSetInfoCardState={setInfoCardState}
	/>
}

function App() {
	const [pageNumber, setPageNumber] = useState(0);
	const [isFuzzy, setIsFuzzy] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [error, setError] = useState('');
	const [bookRecommEles, setBookRecommEles] = useState([]);
	const [infoBox1Content, setInfoBox1Content] = useState([]);
	const [infoBox2Content, setInfoBox2Content] = useState([]);
	const [booksRecommendationList, setBooksRecommendationList] = useState([]);

	useEffect(() => {
		try {
			fetch(
				API_URL + '/recommendrandom',
				{
					method: 'GET'
				}
			)
				.then(res => res.json())
				.then(listOfRecomm => {
					setBooksRecommendationList(listOfRecomm['suggested'])
				});
		} catch (err) {
			setErrorWrapper('Trouble Connecting to the server');
		}
	}
		, []);

	useEffect(() => {
		createBookRecommEles();
	}, [pageNumber , booksRecommendationList]);

	function setErrorWrapper(errorMsg) {
		bookSearchEles = [];
		setBooksRecommendationList([]);
		setBookRecommEles([]);
		setPageNumber(0);
		setError(errorMsg);
	}

	function createFuzzySearchEles(data) {
		bookSearchEles = data['searched'].map(bookObject => {
			return mapBookObjectToBookTile(bookObject, infoBox1Content, setInfoBox1Content);
		});
	}

	function createExactSearchEles(data) {
		bookSearchEles = [mapBookObjectToBookTile(data['searched'], infoBox1Content, setInfoBox1Content)]
	}

	function createBookRecommEles() {
		if (!booksRecommendationList.length) {
			return;
		}

		const tempArr = booksRecommendationList.slice(pageNumber * 5, (pageNumber + 1) * 5);
		setBookRecommEles(tempArr.map(bookObject => {
			return mapBookObjectToBookTile(bookObject, infoBox2Content, setInfoBox2Content);
		}));
	}

	function handleSearchTermChange(event) {
		setSearchTerm(event.target.value);
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (!searchTerm.trim()) {
			setErrorWrapper('Search Field cannot be empty');
			return;
		}
		setError('');

		try {
			const response = await fetch(
				API_URL + '/recommendbysearch?' +
				new URLSearchParams({
					'title': searchTerm.trim(),
					'fuzzy': isFuzzy
				}).toString(),
				{
					method: 'GET'
				}
			);

			if (response.status === 200) {
				const data = await response.json();

				if (data) {
					setBooksRecommendationList(data['suggested']);
					isFuzzy ? createFuzzySearchEles(data) : createExactSearchEles(data);
				} else {
					setErrorWrapper('No recommendation found');
				}
			} else {
				setErrorWrapper('Bad response');
			}
		} catch (err) { setErrorWrapper('Connectivity issue') }
	}

	return (
		<>
			<SearchComponent
				handleSubmit={handleSubmit}
				searchTerm={searchTerm}
				handleChange={handleSearchTermChange}
				error={error}
			/>
			<ToggleSlider
				handleToggle={setIsFuzzy}
				toggleStaus={isFuzzy}
			/>
			{bookSearchEles.length > 0 && <div className='search--book-box'>
				<h2 className='book--box-title'>Search Results</h2>
				<div className="search--list">
					{bookSearchEles}
				</div>
				{/* {
					Object.keys(infoBox2Content).length !== 0 &&
					<InfoBox 
					className='info--box-1'
					info={infoBox1Content}
					/>
				} */}
			</div>
			}
			{booksRecommendationList.length > 0 && <div className='recommend--book-box'>
				{bookSearchEles.length === 0 ? <h2 className='book--box-title'>For you</h2> : <h2 className='book--box-title'>Similar to what you like</h2>}
				<div className="recommendation--list">
					{bookRecommEles}
				</div>
				{/* {
					Object.keys(infoBox2Content).length !== 0 &&
					<InfoBox 
					className='info--box-2'
					info={infoBox2Content}
					/>
				} */}
			</div>}
			{bookRecommEles.length > 0 && <PaginationButtons handlePageNumberChange={setPageNumber} />}
			<Tooltip text="hello" />
		</>
	);
}


export default App;