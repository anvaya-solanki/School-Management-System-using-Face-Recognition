import { useSelector } from 'react-redux';

const AdminProfile = () => {

    const { currentUser } = useSelector((state) => state.user);

    return (
        <div>
            Name: {currentUser.name}
            <br />
            Email: {currentUser.email}
            <br />
            School: {currentUser.schoolName}
        </div>
    )
}

export default AdminProfile
