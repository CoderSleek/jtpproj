import { useState, useEffect } from 'react'

import './App.css';
import ToggleSlider from './components/ToggleSlider';
import BookTile from './components/BookTile';
import SearchComponent from './components/SearchComponent';
import PaginationButtons from './components/PaginationButtons';
import { API_URL } from './index.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import SelectComponent from './components/SelectComponent';

function App() {
	const [pageNumber, setPageNumber] = useState(0);
	const [isFuzzy, setIsFuzzy] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [error, setError] = useState('');
	const [bookRecommEles, setBookRecommEles] = useState([]);
	const [booksRecommendationList, setBooksRecommendationList] = useState([]);
	const [searchByGenre, setSearchByGenre] = useState(false);
	const [bookSearchEles, setBookSearchEles] = useState([]);
	const [firstSearchObject, setFirstRecommendationObject] = useState(null);

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
	}, [pageNumber, booksRecommendationList]);

	function setErrorWrapper(errorMsg) {
		setBookSearchEles([]);
		setBooksRecommendationList([]);
		setBookRecommEles([]);
		setPageNumber(0);
		setError(errorMsg);
	}

	function createFuzzySearchEles(data) {
		setFirstRecommendationObject(data['searched'][0]);
		const temp = data['searched'].map(bookObject => {
			return mapBookObjectToBookTile(bookObject, 'search');
		});
		setBookSearchEles(temp);
	}

	function createExactSearchEles(data) {
		setFirstRecommendationObject(data['searched']);
		setBookSearchEles([mapBookObjectToBookTile(data['searched'], 'search')]);
	}

	function createBookRecommEles() {
		if (!booksRecommendationList.length) {
			return;
		}

		const tempArr = booksRecommendationList.slice(pageNumber * 5, (pageNumber + 1) * 5);
		setBookRecommEles(tempArr.map(bookObject => {
			return mapBookObjectToBookTile(bookObject, 'recommendation');
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
					'is_fuzzy': isFuzzy
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

	function mapBookObjectToBookTile(bookObject, type) {
		return <BookTile
			key={bookObject['_id']}
			bookObject={bookObject}
			type={type}
			firstSearchObject={firstSearchObject}
		/>
	}

	return (
		<>
			<SearchComponent
				handleSubmit={handleSubmit}
				searchTerm={searchTerm}
				handleChange={handleSearchTermChange}
				error={error}
				searchByGenreHandler={setSearchByGenre}
			/>
			<ToggleSlider
				handleToggle={setIsFuzzy}
				toggleStaus={isFuzzy}
			/>
			{searchByGenre &&
				<SelectComponent
					setErrorHandler={setErrorWrapper}
					setBookSearchEles={setBookSearchEles}
					setRecommBookHandler={setBooksRecommendationList}
					mapBookObjectToBookTile={mapBookObjectToBookTile}
				/>
			}
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
		</>
	);
}


export default App;