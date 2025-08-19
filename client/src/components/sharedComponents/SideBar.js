import "./NavBar.css"
import {BsFillCollectionFill} from 'react-icons/bs'
import {AiOutlineStock, AiOutlineHistory} from 'react-icons/ai'
import {MdFavoriteBorder} from 'react-icons/md' // Import watchlist icon
import { Link } from 'react-router-dom';

const SideBar = () => {
    return ( 
        <div className="sidebar">
            <div className="sidebarWrapper">
            <div className="sidebarMenu">
                <h3 className="sidebarTitle">Dashboard</h3>
                <ul className="sidebarList">
                    <li className="sidebarListItem">
                        <BsFillCollectionFill />
                        <Link className="text-decoration-none" to="/">My Portfolio</Link>
                    </li>
                    <li className="sidebarListItem">
                        <AiOutlineStock />
                        <Link className="text-decoration-none"  to="/stockmarket">Discover</Link>
                    </li>
                    {/* Add the link to the new Watchlist page */}
                    <li className="sidebarListItem">
                        <MdFavoriteBorder />
                        <Link className="text-decoration-none" to="/watchlist">Watchlist</Link>
                    </li>
                    <li className="sidebarListItem">
                        <AiOutlineHistory />
                        <Link className="text-decoration-none" to="/history">History</Link>
                    </li>
                </ul>
            </div>
        </div>
     </div>
    );
}
 
export default SideBar;
