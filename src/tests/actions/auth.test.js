import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import "@testing-library/jest-dom";
import Swal from "sweetalert2";
import { startChecking, startLogin, startRegister } from "../../actions/auth";
import { types } from "../../types/types";
import * as fetchModule from "../../helpers/fetch";

jest.mock("sweetalert2", () => ({
	fire: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};
let store = mockStore(initState);

Storage.prototype.setItem = jest.fn();

describe("Pruebas en auth.test.js", () => {
	beforeEach(() => {
		store = mockStore(initState);
		jest.clearAllMocks();
	});

	test("startLogin correcto", async () => {
		await store.dispatch(startLogin("seba@gmail.com", "123456"));

		const actions = store.getActions();

		expect(actions[0]).toEqual({
			type: types.authLogin,
			payload: {
				uid: expect.any(String),
				name: expect.any(String),
			},
		});

		expect(localStorage.setItem).toHaveBeenCalledWith(
			"token",
			expect.any(String)
		);

		expect(localStorage.setItem).toHaveBeenCalledWith(
			"token-init-date",
			expect.any(Number)
		);

		// console.log(localStorage.setItem.mock.calls);
		// token = localStorage.setItem.mock.calls[0][1];
	});

	test("startLogin incorrecto", async () => {
		await store.dispatch(startLogin("seba@gmail.com", "123456789"));
		let actions = store.getActions();

		expect(actions).toEqual([]);
		expect(Swal.fire).toHaveBeenCalledWith(
			"Error",
			"Password incorrecto",
			"error"
		);

		await store.dispatch(startLogin("sebastian@gmail.com", "123456"));
		expect(Swal.fire).toHaveBeenCalledWith(
			"Error",
			"Un usuario no existe con ese email",
			"error"
		);
	});

	test("startRegister correcto", async () => {
		fetchModule.fetchSinToken = jest.fn(() => ({
			json() {
				return {
					ok: true,
					uid: "123",
					name: "Carlos",
					token: "ABC123",
				};
			},
		}));

		await store.dispatch(startRegister("test@gmail.com", "123456", "test"));

		const actions = store.getActions();

		expect(actions[0]).toEqual({
			type: types.authLogin,
			payload: {
				uid: "123",
				name: "Carlos",
			},
		});

		expect(localStorage.setItem).toHaveBeenCalledWith("token", "ABC123");

		expect(localStorage.setItem).toHaveBeenCalledWith(
			"token-init-date",
			expect.any(Number)
		);
	});
	test("startChecking correcto", async () => {
		fetchModule.fetchConToken = jest.fn(() => ({
			json() {
				return {
					ok: true,
					uid: "123",
					name: "Carlos",
					token: "ABC123",
				};
			},
		}));

		await store.dispatch(startChecking());

		const actions = store.getActions();

		expect(actions[0]).toEqual({
			type: types.authLogin,
			payload: {
				uid: "123",
				name: "Carlos",
			},
		});

		expect(localStorage.setItem).toHaveBeenCalledWith("token", "ABC123");
	});
});
