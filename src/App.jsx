import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [toggleForm, setToggleForm] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState('');

  const [friends, setFriends] = useState(initialFriends);

  const handleFormToggle = () => {
    setToggleForm((open) => !open);
  }

  const handleAddFriend = (newFriend) => {
    setFriends([...friends, newFriend])
    handleFormToggle();
  }

  const handleSelectedFriend = (id) => {
    if(selectedFriend && selectedFriend.id === id) {
      setSelectedFriend('');
      return;
    }
    setSelectedFriend(friends.filter(friend => friend.id === id)[0]);
  }

  const handleSplit = (bill) => {
    setFriends(friends => friends.map(friend => friend.id === selectedFriend.id ? {...friend, balance: friend.balance + bill} : friend))
    setSelectedFriend('');
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} selectedFriend={selectedFriend} selectFriend={handleSelectedFriend}/>
        {toggleForm && <FormAddFriend addFriend={handleAddFriend}/> }
        <Button onPress={handleFormToggle}> {toggleForm ? 'Close' : 'Add Friend'} </Button>
      </div>
      {selectedFriend && <FormSplitBill friend={selectedFriend} handleSplit={handleSplit}/>}
    </div>
  );
}

function FriendsList ({friends, selectedFriend, selectFriend}){
  return <ul>
    {friends.map((friend) => (
      <Friend friend={friend} key={friend.id} selectedFriend={selectedFriend} selectFriend={selectFriend}/>
    ))}
  </ul>
}

function Friend ({friend, selectedFriend, selectFriend}){
  const isSelected = selectedFriend.id === friend.id;
  return <li className={isSelected ? 'selected': ''}>
    <img src={friend.image} alt={friend.name}/>
    <h3>{friend.name}</h3>
    { friend.balance < 0 && <p className="red">You owe {friend.name} {Math.abs(friend.balance)}$</p> }
    { friend.balance > 0 && <p className="green">{friend.name} owes you {Math.abs(friend.balance)}$</p> }
    { friend.balance === 0 && <p>You and {friend.name} are even.</p> }
    <Button onPress={() => selectFriend(friend.id)}>{isSelected ? 'Close' : 'Select'}</Button>
  </li>
}

function Button({children, onPress}) {
  return  <button className="button" onClick={onPress}>{children}</button>
}

function FormAddFriend ({addFriend}) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');


  const handleSubmit = e => {
    e.preventDefault();
    const id = crypto.randomUUID();

    if (!name || !image) return;

    const newFriend = {
      name,
      image:  `${image}?=${id}`,
      balance: 0,
      id
    }
    setName('');
    setImage('https://i.pravatar.cc/48');
    addFriend(newFriend);
  }

  return <form className="form-add-friend" onSubmit={handleSubmit}>
    <label>👫 Friend Name</label>
    <input type="text" onChange={e => setName(e.target.value)} value={name}/>

    <label>🌄 Image URL</label>
    <input type="text" onChange={e => setImage(e.target.value)} value={image}/>

   <Button>Add</Button>
  </form>
}

function FormSplitBill ({friend, handleSplit}) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : '';
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const handleSubmit = e => {
    e.preventDefault();

    if(!bill || !paidByFriend) return;

    handleSplit(whoIsPaying === "user" ?  paidByFriend : -paidByUser)

    setBill("");
    setPaidByUser("");
    setWhoIsPaying("user");
  }

  return <form className="form-split-bill" onSubmit={handleSubmit}>
    <h2>Split a bill with {friend.name}</h2>

    <label>💰 Bill Value</label>
    <input type="number" value={bill} onChange={e => setBill(Number(e.target.value))}/>

    <label>🧍‍♂️ Your Expense</label>
    <input type="number" value={paidByUser} onChange={e => setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))}/>

    <label>👫 {friend.name}'s Expense</label>
    <input type="number" disabled value={paidByFriend}/>

    <label>🤑 Who is paying the bill?</label>
    <select value={whoIsPaying} onChange={e => setWhoIsPaying(e.target.value)}>
      <option value="user">You</option>
      <option value="friend">{friend.name}</option>
    </select>

    <Button>Split Bill</Button>
  </form>
}

export default App;
