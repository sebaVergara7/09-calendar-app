import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import "@testing-library/jest-dom";

import { LoginScreen } from "../../../components/auth/LoginScreen";
import { startLogin, startRegister } from "../../../actions/auth";
import Swal from "sweetalert2";

jest.mock("../../../actions/auth", () => ({
	startLogin: jest.fn(),
	startRegister: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
	fire: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};
const store = mockStore(initState);

store.dispatch = jest.fn();

const wrapper = mount(
	<Provider store={store}>
		<LoginScreen />
	</Provider>
);

describe("Pruebas en LoginScreen.test.js", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("debe de mostrarse correctamente", () => {
		expect(wrapper).toMatchSnapshot();
	});

	test("debe de llamar el dispatch del login", () => {
		wrapper.find('input[name="lEmail"]').simulate("change", {
			target: {
				name: "lEmail",
				value: "gonzalo@gmail.com",
			},
		});

		wrapper.find('input[name="lPassword"]').simulate("change", {
			target: {
				name: "lPassword",
				value: "7890",
			},
		});

		wrapper.find("form").at(0).prop("onSubmit")({
			preventDefault() {},
		});

		expect(startLogin).toHaveBeenCalledWith("gonzalo@gmail.com", "7890");
	});

	test("No hay registro si las contraseñas son diferentes", () => {
		wrapper.find('input[name="rPassword"]').simulate("change", {
			target: {
				name: "rPassword",
				value: "12345",
			},
		});

		wrapper.find('input[name="rPassword2"]').simulate("change", {
			target: {
				name: "rPassword2",
				value: "7890",
			},
		});

		wrapper.find("form").at(1).prop("onSubmit")({
			preventDefault() {},
		});

		expect(startRegister).not.toHaveBeenCalled();
		expect(Swal.fire).toHaveBeenCalledWith(
			"Error",
			"Las contraseñas deben ser iguales",
			"error"
		);
	});

	test("Registro con contraseñas iguales", () => {
		wrapper.find('input[name="rPassword"]').simulate("change", {
			target: {
				name: "rPassword",
				value: "12345",
			},
		});

		wrapper.find('input[name="rPassword2"]').simulate("change", {
			target: {
				name: "rPassword2",
				value: "12345",
			},
		});

		wrapper.find("form").at(1).prop("onSubmit")({
			preventDefault() {},
		});

		expect(Swal.fire).not.toHaveBeenCalled();
		expect(startRegister).toHaveBeenCalledWith(
			"gonzalo@gmail.com",
			"12345",
			"Gonzalo"
		);
	});
});
