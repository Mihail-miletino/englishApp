export function Word({englishTrans, russianTrans, key, margin}){

    return (
        <div style={{borderRadius: "10px", margin: margin}} key={key} className={"card"}>
            <div style={{padding: "10px 20px 10px 20px", background: "blueviolet", borderRadius: "10px"}} className="card-content">
                <span style={{color: "white", fontSize: "16px", padding: 0, margin: 0}} className="card-title activator text-darken-4">{englishTrans}</span>
            </div>
            <div style={{padding: 0, background: "blueviolet", borderRadius: "10px"}} className="card-reveal">
                <span style={{textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "white", padding: 0, margin: 0, fontSize: "16px"}} className="card-title text-darken-4">{russianTrans}</span>
            </div>
        </div>
    )
}
