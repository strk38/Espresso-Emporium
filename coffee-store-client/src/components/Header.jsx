import { NavLink } from "react-router-dom";


const Header = () => {
    return (
        <div>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/addCoffee'>AddCoffee</NavLink>
            <NavLink to='/users'>Users</NavLink>
            <NavLink to='/signin'>Signin</NavLink>
            <NavLink to='/signup'>Signup</NavLink>
        </div>
    );
};

export default Header;