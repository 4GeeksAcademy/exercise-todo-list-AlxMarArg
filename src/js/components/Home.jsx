import React, {useState} from "react";

const Home = () => {
	//Las 2 siguientes constantes se trata de el valor que se trasmite en el input y un array que los contien.
	const [inputValor, setInputValor] = useState("");
	const [todos, setTodos] = useState(['Make the bed','Walk the dog','Pay taxes','Go on vacation']);
	const [mensajeError, setMensajeError] = useState(null);
	return (
		<div className="container text-center mt-5">
			<h1>My Todos</h1>
            <ul>
				<li><input 
					type="text" 
					onChange={(e)=>setInputValor(e.target.value)} // Aqui se agrega el input a valor
					onKeyPress={(e)=> {
						if(e.key==="Enter"){
							if (!todos.includes(inputValor)){
								setTodos(prev => [...prev, inputValor]);
							}else{
								setMensajeError(`El valor "${inputValor}" ya está en los Todos.`);
            					setTimeout(() => setMensajeError(null), 4050);
							}//Esta mal ajustado el tiempo pero el efecto mola! crea errores si insistes en introducir el valor variar veces
							e.target.value="";
						}}} // se agrega el valor en todos pero unicamente cuando se presiona el boton enter y no esta repetido dentro de todos
					placeholder="What do you need to do?" 					
				/></li>
				{todos.map((item, index) => {
                    return (
                        <li key={index}>
                            {item}{" "}
                            <i className="fa-solid fa-x" onClick={() =>{
								setTodos(todos.filter((t, currentIndex)=>index!=currentIndex))
							}}// se elimina de todos el valor en el que te encuentras
							></i>
                        </li>
					)}
				)}
			</ul>
			<div className="text-left">{todos.length} Taks</div>
			{/*mensajeError && (<div className="alerta-error">{mensajeError}</div>)*/}
			{mensajeError && (<div id="line"><div id="box"></div><div id="mainText">{mensajeError}</div><div id="subText">{"Prueba a introducir otro valor."}</div></div>)}
		</div>
	);
};

export default Home;