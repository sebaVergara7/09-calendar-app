import { fetchConToken, fetchSinToken } from "../../helpers/fetch";

describe("Pruebas en fetch.test.js", () => {
	let token = "";

	test("fetch sin token debe de funcionar", async () => {
		const resp = await fetchSinToken(
			"auth",
			{
				email: "seba@gmail.com",
				password: "123456",
			},
			"POST"
		);

		expect(resp instanceof Response).toBe(true);

		const body = await resp.json();
		expect(body.ok).toBe(true);

		token = body.token;
	});

	test("fetch con token debe de funcionar", async () => {
		localStorage.setItem("token", token);

		const resp = await fetchConToken(
			"events/6228af599005cf55710fd3be",
			{},
			"DELETE"
		);
		const body = await resp.json();

		expect(body.msg).toBe("Evento no existe por ese id");
	});
});
