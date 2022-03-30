import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import "@testing-library/jest-dom";
import { act } from "@testing-library/react";
import Swal from "sweetalert2";

import moment from "moment";
import { CalendarModal } from "../../../components/calendar/CalendarModal";
import {
	eventClearActiveEvent,
	eventStartUpdate,
	startEventAddNew,
} from "../../../actions/events";

jest.mock("../../../actions/events", () => ({
	eventStartUpdate: jest.fn(),
	eventClearActiveEvent: jest.fn(),
	startEventAddNew: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
	fire: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const now = moment().minutes(0).seconds(0).add(1, "hours");
const nowPlus1 = now.clone().add(1, "hours");

const initState = {
	calendar: {
		events: [],
		activeEvent: {
			title: "Hola Mundo",
			notes: "Pruebas",
			start: now.toDate(),
			end: nowPlus1.toDate(),
		},
	},
	auth: {
		uid: "123",
		name: "Sebastián",
	},
	ui: {
		modalOpen: true,
	},
};
const store = mockStore(initState);

store.dispatch = jest.fn();

const wrapper = mount(
	<Provider store={store}>
		<CalendarModal />
	</Provider>
);

describe("Pruebas en CalendarModal.test.js", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("debe de mostrar el modal", () => {
		// expect(wrapper.find(".modal").exists()).toBe(true);
		expect(wrapper.find("Modal").prop("isOpen")).toBe(true);
	});

	test("debe de llamar la acción de actualizar y cerrar el modal", () => {
		wrapper.find("form").simulate("submit", {
			preventDefault() {},
		});

		expect(eventStartUpdate).toHaveBeenCalledWith(
			initState.calendar.activeEvent
		);

		expect(eventClearActiveEvent).toHaveBeenCalled();
	});

	test("debe de mostrar error si falta el título", () => {
		wrapper.find("form").simulate("submit", {
			preventDefault() {},
		});

		expect(wrapper.find('input[name="title"]').hasClass("is-invalid")).toBe(
			true
		);
	});

	test("debe de crear un nuevo evento", () => {
		const initState = {
			calendar: {
				events: [],
				activeEvent: null,
			},
			auth: {
				uid: "123",
				name: "Sebastián",
			},
			ui: {
				modalOpen: true,
			},
		};
		const store = mockStore(initState);
		store.dispatch = jest.fn();

		const wrapper = mount(
			<Provider store={store}>
				<CalendarModal />
			</Provider>
		);

		wrapper.find('input[name="title"]').simulate("change", {
			target: {
				name: "title",
				value: "Título",
			},
		});

		wrapper.find("form").simulate("submit", {
			preventDefault() {},
		});

		expect(startEventAddNew).toHaveBeenCalledWith({
			end: expect.anything(),
			start: expect.anything(),
			title: "Título",
			notes: "",
		});

		expect(eventClearActiveEvent).toHaveBeenCalled();
	});

	test("debe de validar las fechas", () => {
		wrapper.find('input[name="title"]').simulate("change", {
			target: {
				name: "title",
				value: "Título",
			},
		});

		const hoy = new Date();
		act(() => {
			wrapper.find("DateTimePicker").at(1).prop("onChange")(hoy);
		});

		wrapper.find("form").simulate("submit", {
			preventDefault() {},
		});

		expect(Swal.fire).toHaveBeenCalledWith("Error", "La fecha fin debe de ser mayor a la fecha de inicio", "error");
	});
});
