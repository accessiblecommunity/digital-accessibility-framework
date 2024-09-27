import { a as apiGet, i as idFrag } from './util-base_RWCnFOo0.mjs';
import { b as buildMatrix } from './build-matrix_DW4ydoMS.mjs';

async function fetchData() {
	return new Promise((resolve) => {
		let promises = new Array();
		
		promises.push(apiGet("accessibility-characteristic-groups"));
		promises.push(apiGet("accommodation-types"));
		promises.push(apiGet("functional-ability-groups"));
		promises.push(apiGet("intersection-curve-maps"));
		promises.push(apiGet("simple-curve-maps"));
		promises.push(apiGet("statements"));

		Promise.all(promises).then(async (values) => {
			const gpChar = values[0];
			const accommodationTypes = values[1];
			const gpFa = values[2];
			values[3];
			const simpleCurveMaps = values[4];
			const statements = values[5];

			var acgPromises = new Array();
			var fagPromises = new Array();

			gpChar.forEach(function (group) {
				acgPromises.push(
					apiGet(
						"accessibility-characteristic-groups/" + idFrag(group.id)
					)
				);
			});
			gpFa.forEach(function (group) {
				fagPromises.push(
					apiGet("functional-ability-groups/" + idFrag(group.id))
				);
			});

			var innerPromises = new Array();
			innerPromises.push(Promise.all(acgPromises));
			innerPromises.push(Promise.all(fagPromises));
			Promise.all(innerPromises).then((innerValues) => {
				var accessibilityCharacteristicGroups = new Array(); innerValues[0];
				var functionalAbilityGroups = new Array(); innerValues[1];

				innerValues[0].forEach(function (group) {
					accessibilityCharacteristicGroups.push(group[0]);
				});
				innerValues[1].forEach(function (group) {
					functionalAbilityGroups.push(group[0]);
				});
				let data = {"accessibilityCharacteristicGroups": accessibilityCharacteristicGroups, "accommodationTypes": accommodationTypes, "functionalAbilityGroups": functionalAbilityGroups, "simpleCurveMaps": simpleCurveMaps, "statements": statements};
				//console.log(data);
				resolve(JSON.stringify(data));
			});
		});
	});
}

async function getTable() {
    const data = await fetchData();
	let scrPath = "./src/pages/matrix-accommtype/build-matrix-script.js";
	let table = await buildMatrix(scrPath, data);
	return table;
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	getTable
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _, getTable as g };
