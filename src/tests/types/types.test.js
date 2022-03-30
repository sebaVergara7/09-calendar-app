import { types } from "../../types/types";

describe("Pruebas en types.test.js", () => {
	test("los types deben de ser iguales", () => {
		expect(types).toEqual({
			uiOpenModal: "[ui] Open modal",
			uiCloseModal: "[ui] Close modal",

			eventSetActive: "[event] Event set active",
			eventLogout: "[event] Event Logout",

			eventStartAddNew: "[event] Start add new",
			eventAddNew: "[event] Event add new",
			eventClearActiveEvent: "[event] Event clear active event",
			eventUpdated: "[event] Event updated",
			eventDeleted: "[event] Event deleted",
			eventLoaded: "[event] Event loaded",

			// authChecking: '[auth] Checking login state',
			authCheckingFinish: "[auth] Finish checking login state",
			authStartLogin: "[auth] Start login",
			authLogin: "[auth] Login",
			authStartRegister: "[auth] Start register",
			authStartTokenRenew: "[auth] Start Token renew",
			authLogout: "[auth] Logout",
		});
	});
});
