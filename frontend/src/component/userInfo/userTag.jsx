import { useSelector } from 'react-redux';
import './userInfo.css';
import InfoModal from '../info/info';

export default function UserTag(){
    const user = useSelector(state => state.auth.user);
    const [modalType, setModalType] = useState(null);

    const userInfoClickHandler = () => {
        setModalType("info");
    }

    const onClose = () => setModalType(null);

    return(
        <div className='tag'>
            <p onClick={userInfoClickHandler}>{user ? (user.email) : (로그인)}</p>
            {modalType && (<InfoModal />)}
        </div>
    )
}