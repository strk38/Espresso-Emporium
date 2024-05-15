import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'

const CoffeeCard = ({ coffee, coffees, setCoffees }) => {
    const { _id, name, quantity, supplier, taste, category, details, photo } = coffee;

    const handleDelete = (_id) => {
        console.log(_id);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {

                fetch(`http://localhost:5000/coffee/${_id}`, {

                    method: 'DELETE'
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        if (data.deletedCount > 0) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your Cofee has been deleted.",
                                icon: "success"
                            });
                            const remaining = coffees.filter(cof => cof._id != _id);
                            setCoffees(remaining);
                        }
                    })
            }
        });
    }

    return (
        <div className="card card-side bg-base-100 shadow-xl">
            <figure className=""><img src={photo} alt="Coffee" /></figure>
            <div className="flex justify-between  w-full pr-4 pt-2">
                <div>
                    <h2 className="card-title">Name: {name}</h2>
                    <p>Supplier: {supplier}</p>
                    <p>Quantity: {quantity}</p>
                    <p>Category: {category} Details: {details}</p>
                    <p>Taste: {taste}</p>
                </div>
                <div className="card-actions justify-end">
                    <div className="grid space-y-1">
                        <button className="btn btn-active">View</button>
                        <Link to={`updateCoffee/${_id}`}><button className="btn">Edit</button></Link>
                        <button onClick={() => handleDelete(_id)} className="btn bg-red-500 text-white">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoffeeCard;