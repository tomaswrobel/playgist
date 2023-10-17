import {cookies} from "next/headers";
import LocalEditor from "./components/local-ide";

export default function Home() {
	const auth = cookies().get("token")?.value;
	return <LocalEditor auth={!!auth} />;
}