
export default function PodcastCard({ podcast }) {
  return (
    <li className="p-4 border rounded shadow">
      <div className="flex items-center">
        <img 
          src={`/${podcast.image}`} 
          alt={podcast.title} 
          width={312} 
          height={180} 
          className="h-[180px] w-[312px] object-cover" 
        />
      </div>
      <h2 className="text-2xl font-semibold mt-2">{podcast.title}</h2>
      <div className="flex justify-between text-sm">
        <p className="text-gray-600">By: {podcast.podcaster.username}</p>
        <p className="text-gray-600">{podcast.views} views</p>
      </div>
    </li>
  );
}