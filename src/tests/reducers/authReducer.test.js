import { authReducer } from "../../reducers/authReducer";
import { types } from "../../types/types";

const initState = {
	checking: true,
};

describe("Pruebas en authReducer.test.js", () => {
	test("debe de retornar el estado por defecto", () => {
		const action = {};
		const state = authReducer(initState, action);

		expect(state).toEqual(initState);
	});

	test("debe de autenticar el usuario", () => {
		const action = {
			type: types.authLogin,
			payload: {
				uid: "123",
				name: "Sebastián",
			},
		};

		const state = authReducer(initState, action);
		expect(state).toEqual({ checking: false, uid: "123", name: "Sebastián" });
	});
});
