"use strict";

var fs = require("fs"),
    path = require("path"),
    program = require("commander");

program.
	option("-n --number <number-of-modules>", "Number of modules to create", 100).
	option("-i --imports <number-of-imports>", "Number of modules to import into each module", 4).
	parse(process.argv);

var modulesToCreate = createModuleObjects(program.number);

linkUpImports(0, 1);

function createModuleObjects(numberOfModulesToCreate) {
	var modules = [];

	for(var moduleToCreate = 0; moduleToCreate < numberOfModulesToCreate; moduleToCreate++) {
		modules.push({ moduleName: "Module" + moduleToCreate, imports: [] });
	}

	return modules;
}

function linkUpImports(currentModule, nextModuleToImport) {
	var moduleToImportTo = nextModuleToImport + program.imports;
	var moduleRequiringImportLinks = modulesToCreate[currentModule];
	var modulesToImport = modulesToCreate.slice(nextModuleToImport, moduleToImportTo);

	moduleRequiringImportLinks.imports = modulesToImport;

	if(moduleToImportTo < modulesToCreate.length) {
		linkUpImports(++currentModule, moduleToImportTo);
	}
};

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

createModuleFile(modulesToCreate[0]);

//var moduleHead = createModuleHead(modulesToCreate[0].imports);
//console.info(moduleHead);

function createModuleFile(moduleObject) {
	var moduleFileName = path.join(".", "src", moduleObject.moduleName) + ".js";
	var moduleFileWriteStream = fs.createWriteStream(moduleFileName);
	var moduleHead = createModuleHead(moduleObject.imports);
	
	moduleFileWriteStream.write(moduleHead);
}

function createModuleHead(moduleImports) {
	var moduleHead = "";
	
	for(var importedModule = 0; importedModule < moduleImports.length; importedModule++) {
		var moduleToImport = moduleImports[importedModule];
		var moduleNumber = moduleToImport.moduleName.replace("Module", "");
		moduleHead += 'import {Class' + moduleNumber + '} from "./Module' + moduleNumber + '";\n';
	}
	
	return moduleHead;
}
