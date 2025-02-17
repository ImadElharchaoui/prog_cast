import { useRouter } from "next/navigation";
export default function PodcastCard({ podcast }) {
  const route = useRouter();
  return (
    <li className="p-4 border rounded shadow cursor-pointer"
        onClick={()=>{route.push(`/podcast/${podcast._id}`)}}>
      <div className="flex items-center">
        {console.log(podcast)}
        <img 
          src={`/${podcast.image}`} 
          alt={podcast.title} 
          width={312} 
          height={180} 
          className="h-[180px] w-[312px] object-cover" 
        />
      </div>
      <h2 className="text-2xl font-semibold mt-2">{podcast.title}</h2>
      <div className="flex justify-between text-sm mt-1">
        <img src={podcast.podcaster.image} alt="" srcset={podcast.podcaster.image} className="h-8 w-8 rounded-full mr-2" />
        <div className="flex w-full justify-between items-center">
          <p className="text-0gray-600 flex "> {podcast.podcaster.username}</p>
          <p className="text-gray-600">{new Date(podcast.createdAt).toLocaleDateString()}</p>
          <p className="text-gray-600">{podcast.views} views</p>
        </div>
      </div>
    </li>
  );
}
