import { useState, useEffect } from 'react'

import './App.css';
import ToggleSlider from './components/ToggleSlider';
import BookTile from './components/BookTile';
import SearchComponent from './components/SearchComponent';
import PaginationButtons from './components/PaginationButtons';

import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000';
let bookSearchEles = [];

// function renderRandomSuggestions(){

// }

function createFuzzySearchEles(data){
	bookSearchEles = data['searched'].map(mapBookObjectToBookTile);
}

function createExactSearchEles(data){
	bookSearchEles = [mapBookObjectToBookTile(data['searched'])]
}

function mapBookObjectToBookTile(bookObject){
	return <BookTile
		key={bookObject['_id']}
		id={bookObject['_id']}
		title={bookObject.title}
		coverImg={bookObject.coverImg}
		rating={bookObject.rating}
		description={bookObject.description}
		genres={bookObject.genres}
	/>
}

function App() {
	const [pageNumber, setPageNumber] = useState(0);
	const [isFuzzy, setIsFuzzy] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [error, setError] = useState('');
	const [bookRecommEles, setBookRecommEles] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [booksRecommendationList, setBooksRecommendationList] = useState([]);

	useEffect(() =>{
		try{
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
		} catch(err){
			setErrorWrapper('Trouble Connecting to the server');
		}}
	, []);

	useEffect(()=>{
		createBookRecommEles();
	}, [booksRecommendationList, pageNumber]);


	function setErrorWrapper(errorMsg){
		bookSearchEles = [];
		setBooksRecommendationList([]);
		setBookRecommEles([]);
		setPageNumber(0);
		setError(errorMsg);
	}

	function createBookRecommEles(){
		if(!booksRecommendationList.length){
			return;
		}

		const tempArr = booksRecommendationList.slice(pageNumber * 5, (pageNumber + 1) * 5);
		setBookRecommEles(tempArr.map(mapBookObjectToBookTile));
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
		} catch(err) { setErrorWrapper('Connectivity issue') }
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
			{bookSearchEles.length > 0 && <div>
				<h2 className='book--box-title'>Search Results</h2>
					<div className="search--list">
						{bookSearchEles}
					</div>
				</div>
			}
			{booksRecommendationList.length > 0 && <div>
				{bookSearchEles.length === 0 ? <h2 className='book--box-title'>For you</h2> : <h2 className='book--box-title'>Similar to what you like</h2>}
				<div className="recommendation--list">
				{bookRecommEles}
				</div>
			</div>}
			{bookRecommEles.length > 0 && <PaginationButtons handlePageNumberChange={setPageNumber}/>}
		</>
	);
}


export default App;