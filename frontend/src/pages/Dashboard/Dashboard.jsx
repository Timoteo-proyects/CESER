import Badge from "../../components/ui/Badge";
import Loading from "../../components/ui/Loading";

function Dashboard() {
    return (
        <div>

            <h1>Dashboard</h1>

            <p style={{ marginTop: "8px", marginBottom: "20px" }}>
                Componentes del ERP
            </p>

            <div style={{ marginBottom: "20px" }}>

                <Badge variant="success">
                    Activo
                </Badge>

                <span style={{ marginLeft: "10px" }}></span>

                <Badge variant="warning">
                    Pendiente
                </Badge>

                <span style={{ marginLeft: "10px" }}></span>

                <Badge variant="danger">
                    Anulado
                </Badge>

            </div>

            <Loading text="Cargando información..." />

        </div>
    );
}

export default Dashboard;