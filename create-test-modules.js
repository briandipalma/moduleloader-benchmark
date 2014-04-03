"use strict";

var fs = require("fs");
var path = require("path");
var program = require("commander");

/**
 * Module hash, used to represent a module.
 * @typedef {Object} ModuleHash
 * @property {string} moduleName - Name of module.
 * @property {ModuleHash[]} imports - An array of imported modules, represented as other ModuleHash objects.
 */

/**
 * @param {number} numberOfModulesToCreate - Number of module objects to generate.
 * @return {ModuleHash[]} An array of ModuleHash objects.
 */
function createModuleObjects(numberOfModulesToCreate) {
	var modules = [];

	for (var moduleToCreate = 0; moduleToCreate < numberOfModulesToCreate; moduleToCreate++) {
		modules.push({
			moduleName: "Module" + moduleToCreate,
			imports: []
		});
	}

	return modules;
}

/**
 * @param {number} currentModule - The module to link up imports for.
 * @param {number} nextModuleToImport - The next module that hasn't been imported yet.
 * @param {ModuleHash[]} modules - All the modules being created.
 * @param {number} numberOfModulesToImport - How many modules each module should import.
 */
function linkUpImports(currentModule, nextModuleToImport, modules, numberOfModulesToImport) {
	var moduleRequiringImportLinks = modules[currentModule];
	var moduleToImportTo = nextModuleToImport + numberOfModulesToImport;
	var modulesToImport = modules.slice(nextModuleToImport, moduleToImportTo);

	moduleRequiringImportLinks.imports = modulesToImport;

	if (moduleToImportTo < modules.length) {
		linkUpImports(++currentModule, moduleToImportTo, modules, numberOfModulesToImport);
	}
}

function createModuleHead(moduleImports) {
	var moduleHead = "";

	for (var importedModule = 0; importedModule < moduleImports.length; importedModule++) {
		var moduleToImport = moduleImports[importedModule];
		var moduleNumber = moduleToImport.moduleName.replace("Module", "");
		moduleHead += "import {Class" + moduleNumber + '} from "./Module' + moduleNumber + '";\n';
	}

	return moduleHead;
}

function createModuleFile(moduleObject) {
	var moduleFileName = path.join(".", "src", moduleObject.moduleName) + ".js";
	var moduleFileWriteStream = fs.createWriteStream(moduleFileName);
	var moduleHead = createModuleHead(moduleObject.imports);

	moduleFileWriteStream.write(moduleHead);
}

function main() {
	program.
	option("-n --number <number-of-modules>", "Number of modules to create", 100).
	option("-i --imports <number-of-imports>", "Number of modules to import into each module", 4).
	parse(process.argv);

	var modulesToCreate = createModuleObjects(program.number);

	linkUpImports(0, 1, modulesToCreate, program.imports);

//	createModuleFile(modulesToCreate[0]);
}

//Given a module object, create a module file with the correct name and the correct imports.

//moduleName Module0

//import {Class1} from "./Module1";
//import {Class2} from "./Module2";
//import {Class3} from "./Module3";
//import {Class4} from "./Module4";

//export Class0 {
//	constructor(identifierGenerator) {
//		this.memberVariable = "Hello World!";
//	}
//
//	classMethod() {
//		console.log(this.memberVariable);
//	}
//}

//var moduleHead = createModuleHead(modulesToCreate[0].imports);
//console.info(moduleHead);