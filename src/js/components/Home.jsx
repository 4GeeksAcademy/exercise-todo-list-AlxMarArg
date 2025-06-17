import React, {useState, useEffect} from "react";

const DOMINIO = "https://playground.4geeks.com/todo";
const USUARIO = "AlexMarArg";

const Home = () => {

	//Las 2 siguientes constantes se trata de el valor que se trasmite en el input y un array que los contien.
	const [inputValor, setInputValor] = useState("");
	const [todos, setTodos] = useState([]);
	const [mensajeError, setMensajeError] = useState(null);
	const [itemsEditing, setItemsEditing] = useState([]);

	useEffect(() => {
    	getData();
  	}, []);

	const getData = async () => {
		try {
			const res = await fetch(`${DOMINIO}/users/${USUARIO}`);
		if (!res.ok) throw new Error("Usuario no encontrado, creando usuario...");
			const data = await res.json();
			setTodos(data.todos);
		} catch (err) {
			await createUser();
		}
	};

	const createUser = async () => {
		await fetch(`${DOMINIO}/users/${USUARIO}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: USUARIO })
		});
		setTodos([]);
	};

	const postValor = async (e) => {
		const newTask = { label: inputValor, is_done: false };
		await fetch(`${DOMINIO}/todos/${USUARIO}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newTask)
		});
		setInputValor("");
		getData();
	};

	const deleteValor = async (id) => {
		await fetch(`${DOMINIO}/todos/${id}`, {
			method: "DELETE",
		});
		getData();
	};

	const isIncludes=()=>{
		return todos.some((item) => item.label === inputValor);
		/*console.log(`Input: ${inputValor}`);
		todos.forEach(element => {
			console.log(`Tarea nº${element.id} :${element.label}`);
			if (element.label === inputValor){return false;}
		});
		return true;*/
	};
		const buttonSee=()=>{
			if (todos.length>1){
				return <button className="btn btn-outline-danger" onClick={deleteTodosValores}>All tasks clear <i className="fa-solid fa-x"></i></button>};
		}

	const deleteTodosValores = async () => {
		for (const tarea of todos) {
			await deleteValor(tarea.id);
		}
		setTodos([]);
	};

	const putValor = async (id, is, lab) => {
		const newTask = { label: lab, is_done: is};
		await fetch(`${DOMINIO}/todos/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newTask)
		});
		setInputValor("");
		setItemsEditing({...itemsEditing, [id]: !itemsEditing[id]});
		getData();
	};

	return (
		<div className="container text-center mt-5">
			<h1>{USUARIO}'s list todos</h1>
            <ul>
				<li><input 
					type="text" 
					onChange={(e)=>setInputValor(e.target.value)} // Aqui se agrega el input a valor
					onKeyPress={(e)=> {
						if(e.key==="Enter"){
							if (isIncludes()){
								setMensajeError(`El valor "${inputValor}" ya existe en las tareas.`);
            					setTimeout(() => setMensajeError(null), 4050);
							}else{
								//setTodos(prev => [...prev, inputValor]);
								postValor();
							}//Esta mal ajustado el tiempo pero el efecto mola! crea errores si insistes en introducir el valor variar veces
							e.target.value="";
						}}} // se agrega el valor en todos pero unicamente cuando se presiona el boton enter y no esta repetido dentro de todos
					placeholder="What do you need to do?" 					
				/></li>
				{todos.map((item) => {
                    return (<>
                        <li key={item.id} className={`${item.is_done ? 'done' : ''}`}>
                            {item.label}{" "}<div><i className={`fa-solid fa-pen-to-square px-4 ${itemsEditing[item.id] ? 'isEdit' : ''}`} onClick={() => {
								setItemsEditing({...itemsEditing, [item.id]: !itemsEditing[item.id]});
							}}></i>
                            <i className="fa-solid fa-x" onClick={() =>{
								//setTodos(todos.filter((t, currentIndex)=>index!=currentIndex))
								deleteValor(item.id);
							}}// se elimina de todos el valor en el que te encuentras
							></i></div>
                        </li>
						<ul className={`edit ${itemsEditing[item.id] ? '' : 'hidden'}`}>
							<li className={`${item.is_done ? 'done' : ''}`}><input 
									type="text" 
									onChange={(e)=>setInputValor(e.target.value)}
									onKeyPress={(e)=> {
									if(e.key==="Enter"){
										if (isIncludes()){
											setMensajeError(`El valor "${inputValor}" ya existe en las tareas.`);
											setTimeout(() => setMensajeError(null), 4050);
										}else{
											putValor(item.id, item.is_done, inputValor);
										}
										e.target.value="";
									}}} 
									placeholder="What do you need to change in the task?" 					
								/><label for={`done${item.id}`}>Done:</label>
  								<input type="checkbox" id={`done${item.id}`} defaultChecked={item.is_done} onClick={()=>{putValor(item.id, !(item.is_done), item.label);}} />
							</li>
						</ul>
					</>
					)}
				)}
			</ul>
			<div className="text-left">{todos.length} Taks {buttonSee()}</div>
			{mensajeError && (<div id="line"><div id="box"></div><div id="mainText">{mensajeError}</div><div id="subText">{"Prueba a introducir otro valor."}</div></div>)}
		</div>
	);
};

export default Home;