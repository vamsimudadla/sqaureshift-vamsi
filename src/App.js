import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import { useMemo } from 'react';

function App() {
  const [albums, setAlbums] = useState([])
  const [photos, setPhotos] = useState([])
  const [selectedAlbumId, setSelectedAlbumId] = useState(null)

  const albumPhotos = useMemo(()=>{
    if(selectedAlbumId){
    return photos.filter(photo=>photo.albumId === selectedAlbumId)
    }
    return []
  },[selectedAlbumId])

  const fetchData = async () => {
    const albumsResponse = fetch('https://jsonplaceholder.typicode.com/albums')
    const photosResponse = fetch("https://jsonplaceholder.typicode.com/photos")
    Promise.all([albumsResponse,photosResponse]).then(async (responses)=>{
      const albumsData = await responses[0].json()
      const photosData = await responses[1].json()
      setAlbums(albumsData)
      setPhotos(photosData)
    }).catch(err=>{
      alert("Something went wrong.")
    })
  }

  useEffect(()=>{
    fetchData()
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <select value={selectedAlbumId} onChange={(e)=>{
          setSelectedAlbumId(parseInt(e.target.value))
        }}>
          <option value={"Select"} onSelect={()=>{
            setSelectedAlbumId(null)
          }}>Please select album</option>
          {
            albums.map(album=><option key={album.id} value={album.id}>{album.title}</option>)
          }
        </select>
        {
          selectedAlbumId ? albumPhotos.length ? <div className='photos-container'>
            {
              albumPhotos.map(photo=><img key={photo.id} src={photo.url} className='photo' alt={photo.title}/>)
            }
          </div> : <p>No photos related to album</p>  : null
        }
      </header>
    </div>
  );
}

export default App;
