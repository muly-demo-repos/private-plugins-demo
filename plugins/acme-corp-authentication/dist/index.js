/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 262:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  pascalCase: () => (/* binding */ pascalCase),
  pascalCaseTransform: () => (/* binding */ pascalCaseTransform),
  pascalCaseTransformMerge: () => (/* binding */ pascalCaseTransformMerge)
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(635);
;// CONCATENATED MODULE: ./node_modules/lower-case/dist.es2015/index.js
/**
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 */
var SUPPORTED_LOCALE = {
    tr: {
        regexp: /\u0130|\u0049|\u0049\u0307/g,
        map: {
            İ: "\u0069",
            I: "\u0131",
            İ: "\u0069",
        },
    },
    az: {
        regexp: /\u0130/g,
        map: {
            İ: "\u0069",
            I: "\u0131",
            İ: "\u0069",
        },
    },
    lt: {
        regexp: /\u0049|\u004A|\u012E|\u00CC|\u00CD|\u0128/g,
        map: {
            I: "\u0069\u0307",
            J: "\u006A\u0307",
            Į: "\u012F\u0307",
            Ì: "\u0069\u0307\u0300",
            Í: "\u0069\u0307\u0301",
            Ĩ: "\u0069\u0307\u0303",
        },
    },
};
/**
 * Localized lower case.
 */
function localeLowerCase(str, locale) {
    var lang = SUPPORTED_LOCALE[locale.toLowerCase()];
    if (lang)
        return lowerCase(str.replace(lang.regexp, function (m) { return lang.map[m]; }));
    return lowerCase(str);
}
/**
 * Lower case as a function.
 */
function lowerCase(str) {
    return str.toLowerCase();
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/no-case/dist.es2015/index.js

// Support camel case ("camelCase" -> "camel Case" and "CAMELCase" -> "CAMEL Case").
var DEFAULT_SPLIT_REGEXP = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g];
// Remove all non-word characters.
var DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi;
/**
 * Normalize the string into something other libraries can manipulate easier.
 */
function noCase(input, options) {
    if (options === void 0) { options = {}; }
    var _a = options.splitRegexp, splitRegexp = _a === void 0 ? DEFAULT_SPLIT_REGEXP : _a, _b = options.stripRegexp, stripRegexp = _b === void 0 ? DEFAULT_STRIP_REGEXP : _b, _c = options.transform, transform = _c === void 0 ? lowerCase : _c, _d = options.delimiter, delimiter = _d === void 0 ? " " : _d;
    var result = replace(replace(input, splitRegexp, "$1\0$2"), stripRegexp, "\0");
    var start = 0;
    var end = result.length;
    // Trim the delimiter from around the output string.
    while (result.charAt(start) === "\0")
        start++;
    while (result.charAt(end - 1) === "\0")
        end--;
    // Transform each token independently.
    return result.slice(start, end).split("\0").map(transform).join(delimiter);
}
/**
 * Replace `re` in the input string with the replacement value.
 */
function replace(input, re, value) {
    if (re instanceof RegExp)
        return input.replace(re, value);
    return re.reduce(function (input, re) { return input.replace(re, value); }, input);
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/pascal-case/dist.es2015/index.js


function pascalCaseTransform(input, index) {
    var firstChar = input.charAt(0);
    var lowerChars = input.substr(1).toLowerCase();
    if (index > 0 && firstChar >= "0" && firstChar <= "9") {
        return "_" + firstChar + lowerChars;
    }
    return "" + firstChar.toUpperCase() + lowerChars;
}
function pascalCaseTransformMerge(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}
function pascalCase(input, options) {
    if (options === void 0) { options = {}; }
    return noCase(input, (0,tslib_es6.__assign)({ delimiter: "", transform: pascalCaseTransform }, options));
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 139:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createAppServices = void 0;
const csharp_ast_1 = __webpack_require__(701);
function createAppServices(programClass) {
    programClass.appBlocks.push(new csharp_ast_1.CodeBlock({
        code: `app.UseApiAuthentication();`,
    }));
    programClass.appBlocks.push(new csharp_ast_1.CodeBlock({
        code: `using (var scope = app.Services.CreateScope())
  {
      var services = scope.ServiceProvider;
      await RolesManager.SyncRoles(services, app.Configuration);
  }`,
    }));
    programClass.appBlocks.push(new csharp_ast_1.CodeBlock({
        code: `
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        await SeedDevelopmentData.SeedDevUser(services, app.Configuration);
    }`,
    }));
}
exports.createAppServices = createAppServices;


/***/ }),

/***/ 490:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createBuildersServices = void 0;
const csharp_ast_1 = __webpack_require__(701);
function createBuildersServices(resourceName, programClass) {
    programClass.builderServicesBlocks.push(new csharp_ast_1.CodeBlock({
        code: `builder.Services.AddApiAuthentication();`,
    }));
    const swaggerBuilderIndex = programClass.builderServicesBlocks.findIndex((b) => b.toString().includes("AddSwaggerGen"));
    if (swaggerBuilderIndex === -1)
        return;
    programClass.builderServicesBlocks[swaggerBuilderIndex] = new csharp_ast_1.CodeBlock({
        references: [
            csharp_ast_1.CsharpSupport.classReference({
                namespace: `${resourceName}.APIs`,
                name: resourceName,
            }),
        ],
        code: `builder.Services.AddSwaggerGen(options =>
  {
      options.UseOpenApiAuthentication();
      var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
      options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
  });`,
    });
}
exports.createBuildersServices = createBuildersServices;


/***/ }),

/***/ 498:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRelatedMethodAuthorizeAnnotation = exports.createMethodAuthorizeAnnotation = void 0;
const csharp_ast_1 = __webpack_require__(701);
const get_entity_roles_map_1 = __webpack_require__(991);
function createMethodAuthorizeAnnotation(method, roles) {
    roles &&
        method.annotations?.push(csharp_ast_1.CsharpSupport.annotation({
            reference: csharp_ast_1.CsharpSupport.classReference({
                name: "Authorize",
                namespace: "Microsoft.AspNetCore.Authorization",
            }),
            argument: `Roles = "${roles}"`,
        }));
}
exports.createMethodAuthorizeAnnotation = createMethodAuthorizeAnnotation;
function createRelatedMethodAuthorizeAnnotation(entity, entities, fieldPermanentId, method, methodType, roles) {
    const field = entity.fields.find((field) => field.permanentId === fieldPermanentId);
    const relatedEntity = entities.find((entity) => entity.id === field?.properties?.relatedEntityId);
    if (relatedEntity) {
        const rolesMapping = (0, get_entity_roles_map_1.getEntityRoleMap)(relatedEntity, roles);
        createMethodAuthorizeAnnotation(method, rolesMapping[methodType].roles);
    }
}
exports.createRelatedMethodAuthorizeAnnotation = createRelatedMethodAuthorizeAnnotation;


/***/ }),

/***/ 801:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateSeedDevelopmentDataBody = void 0;
const csharp_ast_1 = __webpack_require__(701);
const utils_1 = __webpack_require__(185);
function CreateSeedDevelopmentDataBody(resourceName, context) {
    const { seedUserEmail, seedUserPassword } = (0, utils_1.getPluginSettings)(context.pluginInstallations);
    return new csharp_ast_1.CodeBlock({
        references: [
            csharp_ast_1.CsharpSupport.classReference({
                name: "Identity",
                namespace: "Microsoft.AspNetCore.Identity",
            }),
            csharp_ast_1.CsharpSupport.classReference({
                name: "EntityFrameworkCore",
                namespace: "Microsoft.AspNetCore.Identity.EntityFrameworkCore",
            }),
            csharp_ast_1.CsharpSupport.classReference({
                name: resourceName,
                namespace: `${resourceName}.Infrastructure`,
            }),
        ],
        code: `
      var context = serviceProvider.GetRequiredService<${resourceName}DbContext>();
      var userStore = new UserStore<IdentityUser>(context);
      var usernameValue = "${seedUserEmail}";
      var passwordValue = "${seedUserPassword}";

      var existingUser = await userStore.FindByEmailAsync(usernameValue);
      if (existingUser != null)
      {
        return;
      }
         
      var user = new IdentityUser
      {
          Email = usernameValue,
          UserName = usernameValue,
          NormalizedUserName = usernameValue.ToUpperInvariant(),
          NormalizedEmail = usernameValue.ToUpperInvariant(),
      };
      var password = new PasswordHasher<IdentityUser>();
      var hashed = password.HashPassword(user, passwordValue);
      user.PasswordHash = hashed;
      await userStore.CreateAsync(user);
      
      var amplicationRoles = configuration
          .GetSection("AmplicationRoles")
          .AsEnumerable()
          .Where(x => x.Value != null)
          .Select(x => x.Value.ToString())
          .ToArray();
      var _roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
      foreach (var role in amplicationRoles)
      {
          await userStore.AddToRoleAsync(user, _roleManager.NormalizeKey(role));
      }
      
      await context.SaveChangesAsync();`,
    });
}
exports.CreateSeedDevelopmentDataBody = CreateSeedDevelopmentDataBody;


/***/ }),

/***/ 213:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createStaticFileFileMap = void 0;
const csharp_ast_1 = __webpack_require__(701);
const code_gen_types_1 = __webpack_require__(288);
const promises_1 = __webpack_require__(324);
const pascal_case_1 = __webpack_require__(262);
async function createStaticFileFileMap(destPath, filePath, context, classReferences) {
    const fileMap = new code_gen_types_1.FileMap(context.logger);
    if (!context.resourceInfo)
        return fileMap;
    const resourceName = (0, pascal_case_1.pascalCase)(context.resourceInfo.name);
    let fileContent = await (0, promises_1.readFile)(filePath, "utf-8");
    fileContent = fileContent.replaceAll("ServiceName", resourceName);
    const file = {
        path: destPath,
        code: new csharp_ast_1.CodeBlock({
            code: fileContent,
            references: classReferences && classReferences,
        }),
    };
    fileMap.set(file);
    return fileMap;
}
exports.createStaticFileFileMap = createStaticFileFileMap;


/***/ }),

/***/ 991:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getEntityRoleMap = exports.getRelatedFieldRolesMap = void 0;
const code_gen_types_1 = __webpack_require__(288);
function getRelatedFieldRolesMap(entity, entities, fieldPermanentId, roleNames) {
    const field = entity.fields.find((field) => field.permanentId === fieldPermanentId);
    const relatedEntity = entities.find((entity) => entity.id === field?.properties?.relatedEntityId);
    if (relatedEntity) {
        return getEntityRoleMap(relatedEntity, roleNames);
    }
    return null;
}
exports.getRelatedFieldRolesMap = getRelatedFieldRolesMap;
function getEntityRoleMap(entity, roleNames) {
    return Object.fromEntries(entity.permissions.map((permission) => {
        return [
            permission.action,
            {
                roles: permission.type === code_gen_types_1.EnumEntityPermissionType.AllRoles
                    ? roleNames
                    : permission.type === code_gen_types_1.EnumEntityPermissionType.Granular
                        ? permission.permissionRoles
                            .map((role) => role.resourceRole.name)
                            .join(",")
                        : null,
            },
        ];
    }));
}
exports.getEntityRoleMap = getEntityRoleMap;


/***/ }),

/***/ 894:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateSeedDevelopmentDataBody = exports.createAppServices = exports.createBuildersServices = exports.createStaticFileFileMap = exports.getRelatedFieldRolesMap = exports.getEntityRoleMap = exports.createRelatedMethodAuthorizeAnnotation = exports.createMethodAuthorizeAnnotation = void 0;
var create_method_authorize_annotation_1 = __webpack_require__(498);
Object.defineProperty(exports, "createMethodAuthorizeAnnotation", ({ enumerable: true, get: function () { return create_method_authorize_annotation_1.createMethodAuthorizeAnnotation; } }));
Object.defineProperty(exports, "createRelatedMethodAuthorizeAnnotation", ({ enumerable: true, get: function () { return create_method_authorize_annotation_1.createRelatedMethodAuthorizeAnnotation; } }));
var get_entity_roles_map_1 = __webpack_require__(991);
Object.defineProperty(exports, "getEntityRoleMap", ({ enumerable: true, get: function () { return get_entity_roles_map_1.getEntityRoleMap; } }));
Object.defineProperty(exports, "getRelatedFieldRolesMap", ({ enumerable: true, get: function () { return get_entity_roles_map_1.getRelatedFieldRolesMap; } }));
var create_static_file_map_1 = __webpack_require__(213);
Object.defineProperty(exports, "createStaticFileFileMap", ({ enumerable: true, get: function () { return create_static_file_map_1.createStaticFileFileMap; } }));
var create_builders_services_1 = __webpack_require__(490);
Object.defineProperty(exports, "createBuildersServices", ({ enumerable: true, get: function () { return create_builders_services_1.createBuildersServices; } }));
var create_app_services_1 = __webpack_require__(139);
Object.defineProperty(exports, "createAppServices", ({ enumerable: true, get: function () { return create_app_services_1.createAppServices; } }));
var create_seed_development_data_1 = __webpack_require__(801);
Object.defineProperty(exports, "CreateSeedDevelopmentDataBody", ({ enumerable: true, get: function () { return create_seed_development_data_1.CreateSeedDevelopmentDataBody; } }));


/***/ }),

/***/ 185:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPluginSettings = void 0;
const tslib_1 = __webpack_require__(635);
const package_json_1 = __webpack_require__(949);
const _amplicationrc_json_1 = tslib_1.__importDefault(__webpack_require__(944));
const getPluginSettings = (pluginInstallations) => {
    const plugin = pluginInstallations.find((plugin) => plugin.npm === package_json_1.name);
    const userSettings = plugin?.settings ?? {};
    const settings = {
        ..._amplicationrc_json_1.default.settings,
        ...userSettings,
    };
    return settings;
};
exports.getPluginSettings = getPluginSettings;


/***/ }),

/***/ 288:
/***/ ((module) => {

module.exports = require("@amplication/code-gen-types");

/***/ }),

/***/ 324:
/***/ ((module) => {

module.exports = require("fs/promises");

/***/ }),

/***/ 928:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 701:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CsharpSupport = void 0;
const tslib_1 = __webpack_require__(635);
tslib_1.__exportStar(__webpack_require__(526), exports);
tslib_1.__exportStar(__webpack_require__(289), exports);
exports.CsharpSupport = tslib_1.__importStar(__webpack_require__(694));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 638:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Access = void 0;
// eslint-disable-next-line @typescript-eslint/naming-convention
exports.Access = {
    Public: "public",
    Private: "private",
    Protected: "protected",
};
//# sourceMappingURL=Access.js.map

/***/ }),

/***/ 409:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Annotation = void 0;
const AstNode_1 = __webpack_require__(789);
class Annotation extends AstNode_1.AstNode {
    reference;
    argument;
    constructor(args) {
        super();
        this.reference = args.reference;
        this.argument = args.argument;
    }
    write(writer) {
        writer.addReference(this.reference);
        writer.write(`${this.reference.name}(`);
        if (this.argument != null) {
            if (typeof this.argument === "string") {
                writer.write(this.argument);
            }
            else {
                this.argument.write(writer);
            }
        }
        writer.write(")");
    }
}
exports.Annotation = Annotation;
//# sourceMappingURL=Annotation.js.map

/***/ }),

/***/ 474:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Class = void 0;
const Access_1 = __webpack_require__(638);
const ClassReference_1 = __webpack_require__(665);
const AstNode_1 = __webpack_require__(789);
class Class extends AstNode_1.AstNode {
    name;
    namespace;
    access;
    abstract;
    static_;
    sealed;
    partial;
    reference;
    interfaceReferences;
    isNestedClass;
    annotations = [];
    splitAnnotations;
    fields = [];
    constructors = [];
    methods = [];
    nestedClasses = [];
    nestedInterfaces = [];
    parentClassReference;
    constructor({ name, namespace, access, abstract, static_, sealed, partial, parentClassReference, interfaceReferences, isNestedClass, annotations, splitAnnotations, }) {
        super();
        this.name = name;
        this.namespace = namespace;
        this.access = access;
        this.abstract = abstract ?? false;
        this.static_ = static_ ?? false;
        this.sealed = sealed ?? false;
        this.partial = partial ?? false;
        this.isNestedClass = isNestedClass ?? false;
        this.annotations = annotations ?? [];
        this.splitAnnotations = splitAnnotations ?? true;
        this.parentClassReference = parentClassReference;
        this.interfaceReferences = interfaceReferences ?? [];
        this.reference = new ClassReference_1.ClassReference({
            name: this.name,
            namespace: this.namespace,
        });
    }
    addField(field) {
        this.fields.push(field);
    }
    addConstructor(constructor) {
        this.constructors.push(constructor);
    }
    addMethod(method) {
        this.methods.push(method);
    }
    addNestedClass(subClass) {
        this.nestedClasses.push(subClass);
    }
    addNestedInterface(subInterface) {
        this.nestedInterfaces.push(subInterface);
    }
    write(writer) {
        if (!this.isNestedClass) {
            writer.writeLine(`namespace ${this.namespace};`);
            writer.newLine();
        }
        if (this.annotations.length > 0) {
            !this.splitAnnotations && writer.write("[");
            this.annotations.forEach((annotation, index) => {
                if (this.splitAnnotations) {
                    writer.write("[");
                    annotation.write(writer);
                    writer.write("]");
                    writer.newLine();
                }
                else {
                    annotation.write(writer);
                    if (index < this.annotations.length - 1) {
                        writer.write(", ");
                    }
                }
            });
            !this.splitAnnotations && writer.write("]");
            writer.writeNewLineIfLastLineNot();
        }
        writer.write(`${this.access}`);
        if ([this.abstract, this.sealed, this.static_].filter((x) => x).length > 1) {
            throw new Error("A class can only be one of abstract, sealed, or static at a time");
        }
        if (this.abstract) {
            writer.write(" abstract");
        }
        if (this.sealed) {
            writer.write(" sealed");
        }
        if (this.static_) {
            writer.write(" static");
        }
        if (this.partial) {
            writer.write(" partial");
        }
        writer.write(" class");
        writer.write(` ${this.name}`);
        if (this.parentClassReference != null ||
            this.interfaceReferences.length > 0) {
            writer.write(" : ");
            if (this.parentClassReference != null) {
                this.parentClassReference.write(writer);
                if (this.interfaceReferences.length > 0) {
                    writer.write(", ");
                }
            }
            this.interfaceReferences.forEach((interfaceReference, index) => {
                interfaceReference.write(writer);
                // Don't write a comma after the last interface
                if (index < this.interfaceReferences.length - 1) {
                    writer.write(", ");
                }
            });
        }
        writer.writeNewLineIfLastLineNot();
        writer.writeLine("{");
        writer.indent();
        this.writeFields({
            writer,
            fields: this.getFieldsByAccess(Access_1.Access.Private),
        });
        writer.dedent();
        writer.indent();
        this.writeFields({
            writer,
            fields: this.getFieldsByAccess(Access_1.Access.Protected),
        });
        writer.dedent();
        writer.indent();
        this.writeConstructors({ writer, constructors: this.constructors });
        writer.dedent();
        writer.indent();
        this.writeFields({ writer, fields: this.getFieldsByAccess(Access_1.Access.Public) });
        writer.dedent();
        writer.indent();
        this.nestedClasses.forEach((nestedClass, index) => {
            nestedClass.write(writer);
            writer.writeNewLineIfLastLineNot();
            if (index < this.fields.length - 1) {
                writer.newLine();
            }
        });
        writer.dedent();
        writer.indent();
        this.nestedInterfaces.forEach((nestedInterface, index) => {
            nestedInterface.write(writer);
            writer.writeNewLineIfLastLineNot();
            if (index < this.fields.length - 1) {
                writer.newLine();
            }
        });
        writer.dedent();
        writer.indent();
        this.writeMethods({
            writer,
            methods: this.getMethodsByAccess(Access_1.Access.Public),
        });
        writer.dedent();
        writer.indent();
        this.writeMethods({
            writer,
            methods: this.getMethodsByAccess(Access_1.Access.Private),
        });
        writer.dedent();
        writer.writeLine("}");
    }
    writeConstructors({ writer, constructors, }) {
        constructors.forEach((constructor, index) => {
            writer.write(`${constructor.access} ${this.name} (`);
            constructor.parameters.forEach((parameter, index) => {
                parameter.write(writer);
                if (index < constructor.parameters.length - 1) {
                    writer.write(", ");
                }
            });
            writer.write(")");
            if (constructor.bases && constructor.bases.length > 0) {
                const bases = constructor.bases;
                writer.write(": base(");
                bases.forEach((base, index) => {
                    writer.write(base);
                    if (index < bases.length - 1) {
                        writer.write(", ");
                    }
                });
                writer.write(")");
            }
            writer.writeLine(" {");
            writer.indent();
            constructor.body?.write(writer);
            writer.dedent();
            writer.writeLine("}");
            writer.newLine();
        });
    }
    writeMethods({ writer, methods, }) {
        methods.forEach((method, index) => {
            method.write(writer);
            writer.writeNewLineIfLastLineNot();
            writer.newLine();
        });
    }
    getMethodsByAccess(access) {
        return this.methods.filter((method) => method.access === access);
    }
    writeFields({ writer, fields, }) {
        fields.forEach((field, index) => {
            field.write(writer);
            writer.writeNewLineIfLastLineNot();
            if (index < this.fields.length - 1) {
                writer.newLine();
            }
        });
    }
    getFieldsByAccess(access) {
        return this.fields.filter((field) => field.access === access);
    }
    getFields() {
        return this.fields;
    }
    getMethods() {
        return this.methods;
    }
}
exports.Class = Class;
//# sourceMappingURL=Class.js.map

/***/ }),

/***/ 713:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClassInstantiation = void 0;
const AstNode_1 = __webpack_require__(789);
class ClassInstantiation extends AstNode_1.AstNode {
    classReference;
    arguments_;
    constructor({ classReference, arguments_ }) {
        super();
        this.classReference = classReference;
        this.arguments_ = arguments_;
    }
    write(writer) {
        writer.write(`new ${this.classReference.name}(`);
        writer.newLine();
        writer.indent();
        this.arguments_.forEach((argument, idx) => {
            if (isNamedArgument(argument)) {
                writer.write(`${argument.name}: `);
                argument.assignment.write(writer);
            }
            else {
                argument.write(writer);
            }
            if (idx < this.arguments_.length - 1) {
                writer.write(", ");
            }
        });
        writer.dedent();
        writer.writeLine(");");
    }
}
exports.ClassInstantiation = ClassInstantiation;
function isNamedArgument(argument) {
    return argument?.name != null;
}
//# sourceMappingURL=ClassInstantiation.js.map

/***/ }),

/***/ 665:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StringEnumClassReference = exports.OneOfClassReference = exports.ClassReference = void 0;
const AstNode_1 = __webpack_require__(789);
class ClassReference extends AstNode_1.AstNode {
    name;
    namespace;
    constructor({ name, namespace }) {
        super();
        this.name = name;
        this.namespace = namespace;
    }
    write(writer) {
        writer.addReference(this);
        writer.write(`${this.name}`);
    }
}
exports.ClassReference = ClassReference;
exports.OneOfClassReference = new ClassReference({
    name: "OneOf",
    namespace: "OneOf",
});
// TODO: remove this in favor of the one in PrebuiltUtilities
exports.StringEnumClassReference = new ClassReference({
    name: "StringEnum",
    namespace: "StringEnum",
});
//# sourceMappingURL=ClassReference.js.map

/***/ }),

/***/ 328:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CodeBlock = void 0;
const AstNode_1 = __webpack_require__(789);
class CodeBlock extends AstNode_1.AstNode {
    value;
    references;
    constructor(args) {
        super();
        this.value = args.code;
        this.references = [];
        if (args.references) {
            this.references.push(...args.references);
        }
    }
    write(writer) {
        if (typeof this.value === "string") {
            this.references.forEach((reference) => writer.addReference(reference));
            writer.write(this.value);
        }
        else {
            this.value(writer);
        }
    }
}
exports.CodeBlock = CodeBlock;
//# sourceMappingURL=CodeBlock.js.map

/***/ }),

/***/ 330:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoreClassReference = void 0;
const AstNode_1 = __webpack_require__(789);
class CoreClassReference extends AstNode_1.AstNode {
    name;
    constructor({ name }) {
        super();
        this.name = name;
    }
    write(writer) {
        writer.write(`${this.name}`);
    }
}
exports.CoreClassReference = CoreClassReference;
//# sourceMappingURL=CoreClassReference.js.map

/***/ }),

/***/ 140:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Dictionary = void 0;
const AstNode_1 = __webpack_require__(789);
class Dictionary extends AstNode_1.AstNode {
    keyType;
    valueType;
    entries;
    constructor({ keyType, valueType, entries }) {
        super();
        this.keyType = keyType;
        this.valueType = valueType;
        this.entries = entries;
    }
    write(writer) {
        writer.write("new Dictionary<");
        this.keyType.write(writer);
        writer.write(", ");
        this.valueType.write(writer);
        writer.write("> {");
        writer.newLine();
        writer.indent();
        for (const { key, value } of this.entries) {
            writer.write("{ ");
            key.write(writer);
            writer.write(", ");
            value.write(writer);
            writer.writeLine(" }, ");
        }
        writer.dedent();
        writer.write("}");
    }
}
exports.Dictionary = Dictionary;
//# sourceMappingURL=Dictionary.js.map

/***/ }),

/***/ 225:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Enum = void 0;
const Annotation_1 = __webpack_require__(409);
const ClassReference_1 = __webpack_require__(665);
const AstNode_1 = __webpack_require__(789);
const System_1 = __webpack_require__(369);
class Enum extends AstNode_1.AstNode {
    name;
    namespace;
    access;
    reference;
    annotations;
    fields = [];
    constructor({ name, namespace, access, annotations }) {
        super();
        this.name = name;
        this.namespace = namespace;
        this.access = access;
        this.annotations = annotations ?? [];
        this.reference = new ClassReference_1.ClassReference({
            name: this.name,
            namespace: this.namespace,
        });
    }
    addMember(field) {
        this.fields.push({
            name: field.name,
            value: new Annotation_1.Annotation({
                reference: System_1.ENUM_MEMBER,
                argument: `Value = "${field.value}"`,
            }),
        });
    }
    write(writer) {
        writer.writeLine(`namespace ${this.namespace};`);
        writer.newLine();
        if (this.annotations.length > 0) {
            writer.write("[");
            for (const annotation of this.annotations) {
                annotation.write(writer);
            }
            writer.writeLine("]");
        }
        writer.write(`${this.access} `);
        writer.write("enum ");
        writer.writeLine(`${this.name}`);
        writer.writeLine("{");
        writer.indent();
        this.fields.forEach((field, index) => {
            writer.write("[");
            field.value.write(writer);
            writer.writeLine("]");
            writer.write(field.name);
            if (index < this.fields.length - 1) {
                writer.writeLine(",");
                writer.newLine();
            }
        });
        writer.writeNewLineIfLastLineNot();
        writer.dedent();
        writer.writeLine("}");
    }
}
exports.Enum = Enum;
//# sourceMappingURL=Enum.js.map

/***/ }),

/***/ 642:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Field = void 0;
const Annotation_1 = __webpack_require__(409);
const ClassReference_1 = __webpack_require__(665);
const AstNode_1 = __webpack_require__(789);
class Field extends AstNode_1.AstNode {
    name;
    access;
    readonly_;
    type;
    get;
    init;
    set;
    annotations;
    initializer;
    summary;
    jsonPropertyName;
    splitAnnotations;
    constructor({ name, type, get, init, set, access, readonly_, annotations, initializer, summary, jsonPropertyName, splitAnnotations, }) {
        super();
        this.name = name;
        this.type = type;
        this.get = get ?? false;
        this.init = init ?? false;
        this.set = set ?? false;
        this.access = access;
        this.readonly_ = readonly_ ?? false;
        this.annotations = annotations ?? [];
        this.initializer = initializer;
        this.summary = summary;
        this.jsonPropertyName = jsonPropertyName;
        this.splitAnnotations = splitAnnotations ?? true;
        if (this.jsonPropertyName != null) {
            this.annotations = [
                new Annotation_1.Annotation({
                    reference: new ClassReference_1.ClassReference({
                        name: "JsonPropertyName",
                        namespace: "System.Text.Json.Serialization",
                    }),
                    argument: `"${this.jsonPropertyName}"`,
                }),
                ...this.annotations,
            ];
        }
    }
    write(writer) {
        if (this.summary != null) {
            writer.writeLine("/// <summary>");
            this.summary.split("\n").forEach((line) => {
                writer.writeLine(`/// ${line}`);
            });
            writer.writeLine("/// </summary>");
        }
        if (this.annotations.length > 0) {
            !this.splitAnnotations && writer.write("[");
            this.annotations.forEach((annotation, index) => {
                if (this.splitAnnotations) {
                    writer.write("[");
                    annotation.write(writer);
                    writer.write("]");
                    writer.newLine();
                }
                else {
                    annotation.write(writer);
                    if (index < (this.annotations ? this.annotations.length : 0) - 1) {
                        writer.write(", ");
                    }
                }
            });
        }
        writer.write(`${this.access} `);
        writer.write(this.readonly_ ? "readonly " : "");
        writer.writeNode(this.type);
        writer.write(` ${this.name}`);
        if (this.get || this.init || this.set) {
            writer.write(" { ");
            if (this.get) {
                writer.write("get; ");
            }
            if (this.init) {
                writer.write("init; ");
            }
            if (this.set) {
                writer.write("set; ");
            }
            writer.write("}");
        }
        if (this.initializer != null) {
            writer.write(" = ");
            this.initializer.write(writer);
            writer.writeLine(";");
        }
        else if (!this.get && !this.init && !this.set) {
            writer.writeLine(";");
        }
    }
}
exports.Field = Field;
//# sourceMappingURL=Field.js.map

/***/ }),

/***/ 766:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GenericClassReference = void 0;
const AstNode_1 = __webpack_require__(789);
class GenericClassReference extends AstNode_1.AstNode {
    reference;
    innerType;
    constructor(args) {
        super();
        this.reference = args.reference;
        this.innerType = args.innerType;
    }
    write(writer) {
        writer.addReference(this.reference);
        writer.write(`${this.reference.name}<`);
        this.innerType.write(writer);
        writer.write(">");
    }
}
exports.GenericClassReference = GenericClassReference;
//# sourceMappingURL=GenericClassReference.js.map

/***/ }),

/***/ 113:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Interface = void 0;
const ClassReference_1 = __webpack_require__(665);
const AstNode_1 = __webpack_require__(789);
const Method_1 = __webpack_require__(25);
class Interface extends AstNode_1.AstNode {
    name;
    namespace;
    access;
    partial;
    reference;
    isNestedInterface;
    fields = [];
    methods = [];
    constructor({ name, namespace, access, partial, isNestedInterface, }) {
        super();
        this.name = name;
        this.namespace = namespace;
        this.access = access;
        this.partial = partial ?? false;
        this.isNestedInterface = isNestedInterface ?? false;
        this.reference = new ClassReference_1.ClassReference({
            name: this.name,
            namespace: this.namespace,
        });
    }
    addField(field) {
        this.fields.push(field);
    }
    addMethod(method) {
        method.classType = Method_1.MethodClassType.INTERFACE;
        this.methods.push(method);
    }
    write(writer) {
        if (!this.isNestedInterface) {
            writer.writeLine(`namespace ${this.namespace};`);
            writer.newLine();
        }
        writer.write(`${this.access} `);
        if (this.partial) {
            writer.write("partial ");
        }
        writer.write("interface ");
        writer.writeLine(`${this.name}`);
        writer.writeLine("{");
        writer.indent();
        for (const field of this.fields) {
            field.write(writer);
            writer.writeLine("");
        }
        writer.dedent();
        writer.indent();
        for (const method of this.methods) {
            method.write(writer);
            writer.writeLine("");
        }
        writer.dedent();
        writer.writeLine("}");
    }
    getMethods() {
        return this.methods;
    }
}
exports.Interface = Interface;
//# sourceMappingURL=Interface.js.map

/***/ }),

/***/ 25:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Method = exports.MethodClassType = exports.MethodType = void 0;
const AstNode_1 = __webpack_require__(789);
const MethodInvocation_1 = __webpack_require__(651);
var MethodType;
(function (MethodType) {
    MethodType[MethodType["INSTANCE"] = 0] = "INSTANCE";
    MethodType[MethodType["STATIC"] = 1] = "STATIC";
})(MethodType || (exports.MethodType = MethodType = {}));
var MethodClassType;
(function (MethodClassType) {
    MethodClassType[MethodClassType["CLASS"] = 0] = "CLASS";
    MethodClassType[MethodClassType["INTERFACE"] = 1] = "INTERFACE";
})(MethodClassType || (exports.MethodClassType = MethodClassType = {}));
class Method extends AstNode_1.AstNode {
    name;
    isAsync;
    access;
    return;
    body;
    summary;
    type;
    reference;
    classType = MethodClassType.CLASS;
    parameters;
    extensionParameter;
    annotations;
    splitAnnotations;
    constructor({ name, isAsync, access, return_, body, summary, type, classReference, parameters, extensionParameter, annotations, splitAnnotations, }) {
        super();
        this.name = name;
        this.isAsync = isAsync;
        this.access = access;
        this.return = return_;
        this.body = body;
        this.summary = summary;
        this.type = type ?? MethodType.INSTANCE;
        this.reference = classReference;
        this.parameters = parameters;
        this.extensionParameter = extensionParameter;
        this.annotations = annotations ?? [];
        this.splitAnnotations = splitAnnotations ?? true;
    }
    addParameter(parameter) {
        this.parameters.push(parameter);
    }
    write(writer) {
        if (this.summary != null) {
            writer.writeLine("/// <summary>");
            this.summary.split("\n").forEach((line) => {
                writer.writeLine(`/// ${line}`);
            });
            writer.writeLine("/// </summary>");
        }
        if (this.annotations && this.annotations.length > 0) {
            !this.splitAnnotations && writer.write("[");
            this.annotations.forEach((annotation, index) => {
                if (this.splitAnnotations) {
                    writer.write("[");
                    annotation.write(writer);
                    writer.write("]");
                    writer.newLine();
                }
                else {
                    annotation.write(writer);
                    if (index < (this.annotations ? this.annotations.length : 0) - 1) {
                        writer.write(", ");
                    }
                }
            });
            !this.splitAnnotations && writer.write("]");
            writer.writeNewLineIfLastLineNot();
        }
        writer.write(`${this.access} `);
        if (this.type === MethodType.STATIC) {
            writer.write("static ");
        }
        if (this.isAsync && this.classType !== MethodClassType.INTERFACE) {
            writer.write("async ");
        }
        if (this.return == null) {
            const voidReturn = this.isAsync ? "Task" : "void";
            writer.write(voidReturn);
            writer.write(" ");
        }
        else {
            if (!this.isAsync) {
                this.return.write(writer);
            }
            else {
                writer.write("Task<");
                this.return.write(writer);
                writer.write(">");
            }
            writer.write(" ");
        }
        writer.write(`${this.name}(`);
        if (this.extensionParameter) {
            writer.write("this ");
            this.extensionParameter.write(writer);
            this.parameters?.length > 0 && writer.write(", ");
        }
        this.parameters.forEach((parameter, idx) => {
            parameter.write(writer);
            if (idx < this.parameters.length - 1) {
                writer.write(", ");
            }
        });
        writer.write(")");
        if (this.classType === MethodClassType.INTERFACE) {
            writer.write(";");
        }
        else {
            writer.writeLine(" {");
            writer.indent();
            this.body?.write(writer);
            writer.dedent();
            writer.writeLine("}");
        }
    }
    getParameters() {
        return this.parameters;
    }
    getInvocation(args, on) {
        return new MethodInvocation_1.MethodInvocation({
            method: this,
            arguments_: args,
            on,
        });
    }
    getInvocationFromExample(example, on) {
        const args = new Map();
        for (const parameter of this.parameters) {
            const value = example.get(parameter.name);
            if (value !== undefined) {
                // TODO: actually handle these examples
                // args.set(parameter, new CodeBlock({ value: value as string }));
            }
        }
        return new MethodInvocation_1.MethodInvocation({
            method: this,
            arguments_: args,
            on,
        });
    }
}
exports.Method = Method;
//# sourceMappingURL=Method.js.map

/***/ }),

/***/ 651:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MethodInvocation = void 0;
const AstNode_1 = __webpack_require__(789);
class MethodInvocation extends AstNode_1.AstNode {
    arguments;
    method;
    on;
    constructor({ method, arguments_, on }) {
        super();
        this.method = method;
        this.arguments = arguments_;
        this.on = on;
    }
    write(writer) {
        if (this.method.isAsync) {
            writer.write("await ");
        }
        if (this.on) {
            this.on.write(writer);
            writer.write(".");
        }
        writer.write(`${this.method.name}(`);
        writer.indent();
        [...this.arguments.entries()].forEach(([parameter, assignment], idx) => {
            parameter.write(writer);
            assignment.write(writer);
            if (idx < this.arguments.size - 1) {
                writer.write(", ");
            }
        });
        writer.dedent();
        writer.write(")");
    }
}
exports.MethodInvocation = MethodInvocation;
//# sourceMappingURL=MethodInvocation.js.map

/***/ }),

/***/ 593:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Parameter = void 0;
const AstNode_1 = __webpack_require__(789);
class Parameter extends AstNode_1.AstNode {
    name;
    docs;
    initializer;
    annotations;
    splitAnnotations;
    type;
    constructor({ name, type, docs, initializer, annotations, splitAnnotations, }) {
        super();
        this.name = name;
        this.type = type;
        this.docs = docs;
        this.annotations = annotations ?? [];
        this.splitAnnotations = splitAnnotations ?? true;
    }
    write(writer) {
        if (this.annotations && this.annotations.length > 0) {
            !this.splitAnnotations && writer.write("[");
            this.annotations.forEach((annotation, index) => {
                if (this.splitAnnotations) {
                    writer.write("[");
                    annotation.write(writer);
                    writer.write("]");
                    writer.newLine();
                }
                else {
                    annotation.write(writer);
                    if (index < (this.annotations ? this.annotations.length : 0) - 1) {
                        writer.write(", ");
                    }
                }
            });
            !this.splitAnnotations && writer.write("]");
            writer.writeNewLineIfLastLineNot();
        }
        this.type.write(writer);
        writer.write(` ${this.name}`);
        if (this.initializer != null) {
            writer.write(` = ${this.initializer}`);
        }
    }
}
exports.Parameter = Parameter;
//# sourceMappingURL=Parameter.js.map

/***/ }),

/***/ 464:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProgramClass = void 0;
const AstNode_1 = __webpack_require__(789);
class ProgramClass extends AstNode_1.AstNode {
    references;
    startFileBlocks;
    builderServicesBlocks;
    appBlocks;
    catchBlocks;
    finallyBlocks;
    endFileBlocks;
    constructor(args) {
        super();
        this.startFileBlocks = args.startFileBlocks ?? [];
        this.builderServicesBlocks = args.builderServicesBlocks;
        this.appBlocks = args.appBlocks;
        this.catchBlocks = args.catchBlocks ?? [];
        this.finallyBlocks = args.finallyBlocks ?? [];
        this.endFileBlocks = args.endFileBlocks ?? [];
        this.references = args.references;
    }
    addReference(reference) {
        this.references.push(reference);
    }
    write(writer) {
        this.references.forEach((reference) => writer.addReference(reference));
        const hasTryCatch = this.catchBlocks.length > 0 || this.finallyBlocks.length > 0;
        if (this.startFileBlocks.length > 0) {
            this.startFileBlocks.forEach((block) => block.write(writer));
            writer.writeLine();
        }
        if (hasTryCatch) {
            writer.writeLine("try");
            writer.writeLine("{");
            writer.indent();
        }
        if (this.builderServicesBlocks.length > 0) {
            this.builderServicesBlocks.forEach((block) => block.write(writer));
            writer.writeLine();
        }
        if (this.appBlocks.length > 0) {
            this.appBlocks.forEach((block) => block.write(writer));
            writer.writeLine();
        }
        if (hasTryCatch) {
            writer.dedent();
            writer.writeLine("}");
            if (this.catchBlocks.length > 0) {
                writer.writeLine("catch(Exception ex)");
                writer.writeLine("{");
                writer.indent();
                this.catchBlocks.forEach((block) => block.write(writer));
                writer.dedent();
                writer.writeLine();
                writer.writeLine("}");
            }
            if (this.finallyBlocks.length > 0) {
                writer.writeLine("finally");
                writer.writeLine("{");
                writer.indent();
                this.finallyBlocks.forEach((block) => block.write(writer));
                writer.dedent();
                writer.writeLine();
                writer.writeLine("}");
            }
        }
        if (this.endFileBlocks.length > 0) {
            this.endFileBlocks.forEach((block) => block.write(writer));
        }
        writer.writeLine();
    }
}
exports.ProgramClass = ProgramClass;
//# sourceMappingURL=ProgramClass.js.map

/***/ }),

/***/ 252:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Type = void 0;
const assertNever_1 = __webpack_require__(943);
const ClassReference_1 = __webpack_require__(665);
const AstNode_1 = __webpack_require__(789);
/* A C# parameter to a method */
class Type extends AstNode_1.AstNode {
    internalType;
    constructor(internalType) {
        super();
        this.internalType = internalType;
    }
    write(writer) {
        switch (this.internalType.type) {
            case "integer":
                writer.write("int");
                break;
            case "long":
                writer.write("long");
                break;
            case "string":
                writer.write("string");
                break;
            case "boolean":
                writer.write("bool");
                break;
            case "double":
                writer.write("double");
                break;
            case "date":
                writer.write("DateOnly");
                break;
            case "dateTime":
                writer.write("DateTime");
                break;
            case "uuid":
                writer.write("Guid");
                break;
            case "object":
                writer.write("object");
                break;
            case "list":
                writer.write("List<");
                this.internalType.value.write(writer);
                writer.write(">");
                break;
            case "set":
                writer.write("HashSet<");
                this.internalType.value.write(writer);
                writer.write(">");
                break;
            case "map":
                writer.write("Dictionary<");
                this.internalType.keyType.write(writer);
                writer.write(", ");
                this.internalType.valueType.write(writer);
                writer.write(">");
                break;
            case "optional":
                this.internalType.value.write(writer);
                writer.write("?");
                break;
            case "reference":
                writer.addReference(this.internalType.value);
                writer.write(this.internalType.value.name);
                break;
            case "coreReference":
                writer.write(this.internalType.value.name);
                break;
            case "genericReference":
                this.internalType.value.write(writer);
                break;
            case "oneOf":
                writer.addReference(ClassReference_1.OneOfClassReference);
                writer.write("OneOf<");
                this.internalType.memberValues.forEach((value, index) => {
                    if (index !== 0) {
                        writer.write(", ");
                    }
                    value.write(writer);
                });
                writer.write(">");
                break;
            case "stringEnum":
                writer.addReference(ClassReference_1.StringEnumClassReference);
                writer.write("StringEnum<");
                this.internalType.value.write(writer);
                writer.write(">");
                break;
            default:
                (0, assertNever_1.assertNever)(this.internalType);
        }
    }
    /* Static factory methods for creating a Type */
    static string() {
        return new this({
            type: "string",
        });
    }
    static boolean() {
        return new this({
            type: "boolean",
        });
    }
    static integer() {
        return new this({
            type: "integer",
        });
    }
    static long() {
        return new this({
            type: "long",
        });
    }
    static double() {
        return new this({
            type: "double",
        });
    }
    static date() {
        return new this({
            type: "date",
        });
    }
    static dateTime() {
        return new this({
            type: "dateTime",
        });
    }
    static uuid() {
        return new this({
            type: "uuid",
        });
    }
    static object() {
        return new this({
            type: "object",
        });
    }
    static list(value) {
        return new this({
            type: "list",
            value,
        });
    }
    static set(value) {
        return new this({
            type: "set",
            value,
        });
    }
    static map(keyType, valueType) {
        return new this({
            type: "map",
            keyType,
            valueType,
        });
    }
    static optional(value) {
        return new this({
            type: "optional",
            value,
        });
    }
    static reference(value) {
        return new this({
            type: "reference",
            value,
        });
    }
    static genericReference(value) {
        return new this({
            type: "genericReference",
            value,
        });
    }
    static coreClass(value) {
        return new this({
            type: "coreReference",
            value,
        });
    }
    static oneOf(memberValues) {
        return new this({
            type: "oneOf",
            memberValues,
        });
    }
    static stringEnum(value) {
        return new this({
            type: "stringEnum",
            value,
        });
    }
}
exports.Type = Type;
//# sourceMappingURL=Type.js.map

/***/ }),

/***/ 226:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TestFixture = void 0;
const __1 = __webpack_require__(526);
const NUNIT_FRAMEWORK_NAMESPACE = "NUnit.Framework";
exports.TestFixture = new __1.ClassReference({
    name: "TestFixture",
    namespace: NUNIT_FRAMEWORK_NAMESPACE,
});
//# sourceMappingURL=NUnit.js.map

/***/ }),

/***/ 369:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ENUM_MEMBER = void 0;
const __1 = __webpack_require__(526);
exports.ENUM_MEMBER = new __1.ClassReference({
    namespace: "System.Runtime.Serialization",
    name: "EnumMember",
});
//# sourceMappingURL=System.js.map

/***/ }),

/***/ 198:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.system = exports.nunit = void 0;
const tslib_1 = __webpack_require__(635);
exports.nunit = tslib_1.__importStar(__webpack_require__(226));
exports.system = tslib_1.__importStar(__webpack_require__(369));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 526:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProgramClass = exports.Dictionary = exports.CoreClassReference = exports.MethodInvocation = exports.ClassInstantiation = exports.Interface = exports.Type = exports.Parameter = exports.MethodType = exports.Method = exports.Field = exports.Enum = exports.dependencies = exports.CodeBlock = exports.GenericClassReference = exports.ClassReference = exports.Class = exports.Annotation = void 0;
const tslib_1 = __webpack_require__(635);
var Annotation_1 = __webpack_require__(409);
Object.defineProperty(exports, "Annotation", ({ enumerable: true, get: function () { return Annotation_1.Annotation; } }));
var Class_1 = __webpack_require__(474);
Object.defineProperty(exports, "Class", ({ enumerable: true, get: function () { return Class_1.Class; } }));
var ClassReference_1 = __webpack_require__(665);
Object.defineProperty(exports, "ClassReference", ({ enumerable: true, get: function () { return ClassReference_1.ClassReference; } }));
var GenericClassReference_1 = __webpack_require__(766);
Object.defineProperty(exports, "GenericClassReference", ({ enumerable: true, get: function () { return GenericClassReference_1.GenericClassReference; } }));
var CodeBlock_1 = __webpack_require__(328);
Object.defineProperty(exports, "CodeBlock", ({ enumerable: true, get: function () { return CodeBlock_1.CodeBlock; } }));
exports.dependencies = tslib_1.__importStar(__webpack_require__(198));
var Enum_1 = __webpack_require__(225);
Object.defineProperty(exports, "Enum", ({ enumerable: true, get: function () { return Enum_1.Enum; } }));
var Field_1 = __webpack_require__(642);
Object.defineProperty(exports, "Field", ({ enumerable: true, get: function () { return Field_1.Field; } }));
var Method_1 = __webpack_require__(25);
Object.defineProperty(exports, "Method", ({ enumerable: true, get: function () { return Method_1.Method; } }));
Object.defineProperty(exports, "MethodType", ({ enumerable: true, get: function () { return Method_1.MethodType; } }));
var Parameter_1 = __webpack_require__(593);
Object.defineProperty(exports, "Parameter", ({ enumerable: true, get: function () { return Parameter_1.Parameter; } }));
var Type_1 = __webpack_require__(252);
Object.defineProperty(exports, "Type", ({ enumerable: true, get: function () { return Type_1.Type; } }));
var Interface_1 = __webpack_require__(113);
Object.defineProperty(exports, "Interface", ({ enumerable: true, get: function () { return Interface_1.Interface; } }));
var ClassInstantiation_1 = __webpack_require__(713);
Object.defineProperty(exports, "ClassInstantiation", ({ enumerable: true, get: function () { return ClassInstantiation_1.ClassInstantiation; } }));
var MethodInvocation_1 = __webpack_require__(651);
Object.defineProperty(exports, "MethodInvocation", ({ enumerable: true, get: function () { return MethodInvocation_1.MethodInvocation; } }));
var CoreClassReference_1 = __webpack_require__(330);
Object.defineProperty(exports, "CoreClassReference", ({ enumerable: true, get: function () { return CoreClassReference_1.CoreClassReference; } }));
var Dictionary_1 = __webpack_require__(140);
Object.defineProperty(exports, "Dictionary", ({ enumerable: true, get: function () { return Dictionary_1.Dictionary; } }));
var ProgramClass_1 = __webpack_require__(464);
Object.defineProperty(exports, "ProgramClass", ({ enumerable: true, get: function () { return ProgramClass_1.ProgramClass; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 789:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AstNode = void 0;
const Writer_1 = __webpack_require__(30);
class AstNode {
    /**
     * Writes the node to a string.
     */
    toString() {
        const writer = new Writer_1.Writer({});
        this.write(writer);
        return writer.toString();
    }
}
exports.AstNode = AstNode;
//# sourceMappingURL=AstNode.js.map

/***/ }),

/***/ 30:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Writer = void 0;
const TAB_SIZE = 4;
class Writer {
    /* The contents being written */
    buffer = "";
    /* Indentation level (multiple of 4) */
    indentLevel = 0;
    /* Whether anything has been written to the buffer */
    hasWrittenAnything = false;
    /* Whether the last character written was a newline */
    lastCharacterIsNewline = false;
    /* The current line number */
    references = {};
    /* The namespace that is being written to */
    namespace;
    constructor({ namespace }) {
        this.namespace = namespace;
    }
    write(text) {
        const textEndsInNewline = text.length > 0 && text.endsWith("\n");
        // temporarily remove the trailing newline, since we don't want to add the indent prefix after it
        const textWithoutNewline = textEndsInNewline
            ? text.substring(0, text.length - 1)
            : text;
        const indent = this.getIndentString();
        let indentedText = textWithoutNewline.replace("\n", `\n${indent}`);
        if (this.isAtStartOfLine()) {
            indentedText = indent + indentedText;
        }
        if (textEndsInNewline) {
            indentedText += "\n";
        }
        this.writeInternal(indentedText);
    }
    writeNode(node) {
        node.write(this);
    }
    /* Only writes a newline if last line in the buffer is not a newline */
    writeLine(text = "") {
        this.write(text);
        this.writeNewLineIfLastLineNot();
    }
    /* Always writes newline */
    newLine() {
        this.writeInternal("\n");
    }
    writeNewLineIfLastLineNot() {
        if (!this.lastCharacterIsNewline) {
            this.writeInternal("\n");
        }
    }
    indent() {
        this.indentLevel++;
    }
    dedent() {
        this.indentLevel--;
    }
    addReference(reference) {
        if (reference.namespace == null) {
            return;
        }
        const namespace = this.references[reference.namespace];
        if (namespace != null) {
            namespace.push(reference);
        }
        else {
            this.references[reference.namespace] = [reference];
        }
    }
    toString() {
        const imports = this.stringifyImports();
        if (imports.length > 0) {
            return `${imports}\n\n${this.buffer}`;
        }
        return this.buffer;
    }
    /*******************************
     * Helper Methods
     *******************************/
    writeInternal(text) {
        if (text.length > 0) {
            this.hasWrittenAnything = true;
            this.lastCharacterIsNewline = text.endsWith("\n");
        }
        return (this.buffer += text);
    }
    isAtStartOfLine() {
        return this.lastCharacterIsNewline || !this.hasWrittenAnything;
    }
    getIndentString() {
        return " ".repeat(this.indentLevel * TAB_SIZE);
    }
    stringifyImports() {
        return (Object.keys(this.references)
            // filter out the current namespace
            .filter((referenceNamespace) => referenceNamespace !== this.namespace)
            .map((ref) => `using ${ref};`)
            .join("\n"));
    }
}
exports.Writer = Writer;
//# sourceMappingURL=Writer.js.map

/***/ }),

/***/ 289:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Writer = exports.AstNode = void 0;
var AstNode_1 = __webpack_require__(789);
Object.defineProperty(exports, "AstNode", ({ enumerable: true, get: function () { return AstNode_1.AstNode; } }));
var Writer_1 = __webpack_require__(30);
Object.defineProperty(exports, "Writer", ({ enumerable: true, get: function () { return Writer_1.Writer; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 943:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.assertNeverNoThrow = exports.assertNever = void 0;
function assertNever(x) {
    throw new Error("Unexpected value: " + JSON.stringify(x));
}
exports.assertNever = assertNever;
// eslint-disable-next-line @typescript-eslint/no-empty-function
function assertNeverNoThrow(_) { }
exports.assertNeverNoThrow = assertNeverNoThrow;
//# sourceMappingURL=assertNever.js.map

/***/ }),

/***/ 694:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Types = exports.programClass = exports.dictionary = exports.enum_ = exports.interface_ = exports.parameter = exports.method = exports.field = exports.codeblock = exports.coreClassReference = exports.invokeMethod = exports.instantiateClass = exports.genericClassReference = exports.classReference = exports.annotation = exports.class_ = void 0;
const ast_1 = __webpack_require__(526);
const GenericClassReference_1 = __webpack_require__(766);
function class_(args) {
    return new ast_1.Class(args);
}
exports.class_ = class_;
function annotation(args) {
    return new ast_1.Annotation(args);
}
exports.annotation = annotation;
function classReference(args) {
    return new ast_1.ClassReference(args);
}
exports.classReference = classReference;
function genericClassReference(args) {
    return new GenericClassReference_1.GenericClassReference(args);
}
exports.genericClassReference = genericClassReference;
function instantiateClass(args) {
    return new ast_1.ClassInstantiation(args);
}
exports.instantiateClass = instantiateClass;
function invokeMethod(args) {
    return new ast_1.MethodInvocation(args);
}
exports.invokeMethod = invokeMethod;
function coreClassReference(args) {
    return new ast_1.CoreClassReference(args);
}
exports.coreClassReference = coreClassReference;
function codeblock(args) {
    return new ast_1.CodeBlock(args);
}
exports.codeblock = codeblock;
function field(args) {
    return new ast_1.Field(args);
}
exports.field = field;
function method(args) {
    return new ast_1.Method(args);
}
exports.method = method;
function parameter(args) {
    return new ast_1.Parameter(args);
}
exports.parameter = parameter;
function interface_(args) {
    return new ast_1.Interface(args);
}
exports.interface_ = interface_;
function enum_(args) {
    return new ast_1.Enum(args);
}
exports.enum_ = enum_;
function dictionary(args) {
    return new ast_1.Dictionary(args);
}
exports.dictionary = dictionary;
function programClass(args) {
    return new ast_1.ProgramClass(args);
}
exports.programClass = programClass;
exports.Types = ast_1.Type;
//# sourceMappingURL=csharp-support.js.map

/***/ }),

/***/ 635:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __addDisposableResource: () => (/* binding */ __addDisposableResource),
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldIn: () => (/* binding */ __classPrivateFieldIn),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __disposeResources: () => (/* binding */ __disposeResources),
/* harmony export */   __esDecorate: () => (/* binding */ __esDecorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __propKey: () => (/* binding */ __propKey),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __runInitializers: () => (/* binding */ __runInitializers),
/* harmony export */   __setFunctionName: () => (/* binding */ __setFunctionName),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
  function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
  function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
        }
        else s |= 1;
      }
      catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
});


/***/ }),

/***/ 944:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"settings":{"seedUserEmail":"test@email.com","seedUserPassword":"P@ssw0rd!"}}');

/***/ }),

/***/ 949:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"name":"acme-corp-authentication","version":"0.1.3","description":"Add Authentication and Authorization to your .NET Services","main":"dist/index.js","nx":{},"scripts":{"dev":"webpack --watch","build":"webpack","prebuild":"rimraf dist"},"author":"Acme Corp Platform Team","license":"Apache-2.0","devDependencies":{"@amplication/csharp-ast":"^0.0.4","@amplication/code-gen-types":"2.0.37","@amplication/code-gen-utils":"^0.0.9","@babel/parser":"^7.18.11","@babel/types":"^7.18.10","@types/lodash":"^4.14.182","@types/normalize-path":"^3.0.0","@typescript-eslint/eslint-plugin":"^5.33.0","@typescript-eslint/parser":"^5.33.0","copy-webpack-plugin":"^12.0.2","eslint":"^8.21.0","jest-mock-extended":"^2.0.7","lodash":"^4.17.21","pascal-case":"^3.1.2","prettier":"^2.6.2","rimraf":"^4.4.1","ts-loader":"^9.4.2","typescript":"^4.9.3","webpack":"^5.75.0","webpack-cli":"^5.0.1","@types/pluralize":"^0.0.29"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const code_gen_types_1 = __webpack_require__(288);
const csharp_ast_1 = __webpack_require__(701);
const pascal_case_1 = __webpack_require__(262);
const core_1 = __webpack_require__(894);
const path_1 = __webpack_require__(928);
class AuthCorePlugin {
    register() {
        return {
            CreateEntityControllerBase: {
                after: this.afterCreateControllerBase,
            },
            CreateControllerBaseModuleFile: {
                after: this.afterCreateControllerBaseModule,
            },
            CreateResourceDbContextFile: {
                after: this.afterCreateResourceDbContextFile,
            },
            LoadStaticFiles: {
                after: this.afterLoadStaticFiles,
            },
            CreateProgramFile: {
                after: this.afterCreateProgramFile,
            },
            CreateSeedDevelopmentDataFile: {
                after: this.afterCreateSeedDevelopmentDataFile,
            },
            CreateServerCsproj: {
                before: this.beforeCreateServerCsproj,
            },
        };
    }
    async beforeCreateServerCsproj(context, eventParams) {
        const { packageReferences } = eventParams;
        packageReferences.push({
            include: "Microsoft.AspNetCore.Identity.EntityFrameworkCore",
            version: "8.0.4",
        });
        packageReferences.push({
            include: "Swashbuckle.AspNetCore.Filters",
            version: "8.0.1",
        });
        return eventParams;
    }
    afterCreateProgramFile({ resourceInfo, serverDirectories }, eventParams, programClassMap) {
        if (!resourceInfo)
            return programClassMap;
        const serviceNamespace = (0, pascal_case_1.pascalCase)(resourceInfo.name);
        const programCsPath = (0, path_1.join)(serverDirectories.srcDirectory, "Program.cs");
        const programClass = programClassMap.get(programCsPath);
        if (!programClass)
            return programClassMap;
        (0, core_1.createBuildersServices)(serviceNamespace, programClass.code);
        (0, core_1.createAppServices)(programClass.code);
        return programClassMap;
    }
    async afterLoadStaticFiles(context, eventParams, files) {
        const { resourceInfo } = context;
        if (!resourceInfo)
            return files;
        const resourceName = (0, pascal_case_1.pascalCase)(resourceInfo.name);
        const destPath = `${eventParams.basePath}/src/APIs/Common/Auth/ProgramAuthExtensions.cs`;
        const filePath = (0, path_1.resolve)(__dirname, "./static/common/auth/ProgramAuthExtensions.cs");
        const programAuthExtensionsFileMap = await (0, core_1.createStaticFileFileMap)(destPath, filePath, context, [
            csharp_ast_1.CsharpSupport.classReference({
                name: `${resourceName}DbContext`,
                namespace: `${resourceName}.Infrastructure`,
            }),
        ]);
        const rolesManagerDestPath = `${eventParams.basePath}/src/Infrastructure/RolesManager.cs`;
        const rolesManagerFilePath = (0, path_1.resolve)(__dirname, "./static/infrastructure/RolesManager.cs");
        const rolesManagerFileMap = await (0, core_1.createStaticFileFileMap)(rolesManagerDestPath, rolesManagerFilePath, context);
        files.mergeMany([programAuthExtensionsFileMap, rolesManagerFileMap]);
        return files;
    }
    afterCreateResourceDbContextFile(context, eventParams, files) {
        const { resourceDbContextPath, resourceName } = eventParams;
        const modelFile = files.get(`${resourceDbContextPath}${resourceName}DbContext.cs`);
        if (!modelFile)
            return files;
        modelFile.code.parentClassReference = csharp_ast_1.CsharpSupport.genericClassReference({
            reference: csharp_ast_1.CsharpSupport.classReference({
                name: `IdentityDbContext`,
                namespace: "Microsoft.AspNetCore.Identity.EntityFrameworkCore",
            }),
            innerType: csharp_ast_1.CsharpSupport.Types.reference(csharp_ast_1.CsharpSupport.classReference({
                name: `IdentityUser`,
                namespace: "Microsoft.AspNetCore.Identity",
            })),
        });
        return files;
    }
    afterCreateControllerBase(context, eventParams, files) {
        const { entity, apisDir, moduleActions, entities } = eventParams;
        const { roles } = context;
        const pascalPluralName = (0, pascal_case_1.pascalCase)(entity.pluralName);
        const roleNames = roles?.map((role) => role.name).join(",");
        const controllerBaseFile = files.get(`${apisDir}/${entity.name}/Base/${pascalPluralName}ControllerBase.cs`);
        const methods = controllerBaseFile?.code.getMethods();
        const entityRolesMap = (0, core_1.getEntityRoleMap)(entity, roleNames);
        for (const moduleAction of moduleActions) {
            switch (moduleAction.actionType) {
                case code_gen_types_1.EnumModuleActionType.Create: {
                    const createMethod = methods?.find((m) => m.name === `Create${entity.name}`);
                    createMethod &&
                        (0, core_1.createMethodAuthorizeAnnotation)(createMethod, entityRolesMap[code_gen_types_1.EnumEntityAction.Create].roles);
                    break;
                }
                case code_gen_types_1.EnumModuleActionType.Delete: {
                    const deleteMethod = methods?.find((m) => m.name === `Delete${entity.name}`);
                    deleteMethod &&
                        (0, core_1.createMethodAuthorizeAnnotation)(deleteMethod, entityRolesMap[code_gen_types_1.EnumEntityAction.Delete].roles);
                    break;
                }
                case code_gen_types_1.EnumModuleActionType.Read: {
                    const readMethod = methods?.find((m) => m.name === entity.name);
                    readMethod &&
                        (0, core_1.createMethodAuthorizeAnnotation)(readMethod, entityRolesMap[code_gen_types_1.EnumEntityAction.View].roles //check if this is the correct type
                        );
                    break;
                }
                case code_gen_types_1.EnumModuleActionType.Find: {
                    const findMethod = methods?.find((m) => m.name === (0, pascal_case_1.pascalCase)(entity.pluralName));
                    findMethod &&
                        (0, core_1.createMethodAuthorizeAnnotation)(findMethod, entityRolesMap[code_gen_types_1.EnumEntityAction.Search].roles //check if this is the correct type
                        );
                    break;
                }
                case code_gen_types_1.EnumModuleActionType.Update: {
                    const updateMethod = methods?.find((m) => m.name === `Update${entity.name}`);
                    updateMethod &&
                        (0, core_1.createMethodAuthorizeAnnotation)(updateMethod, entityRolesMap[code_gen_types_1.EnumEntityAction.Update].roles);
                    break;
                }
                case code_gen_types_1.EnumModuleActionType.ChildrenConnect: {
                    if (!moduleAction.fieldPermanentId)
                        break;
                    const createMethod = methods?.find((m) => m.name.toLowerCase() === moduleAction.name.toLowerCase());
                    createMethod &&
                        (0, core_1.createRelatedMethodAuthorizeAnnotation)(entity, entities, moduleAction.fieldPermanentId, createMethod, code_gen_types_1.EnumEntityAction.Create, roleNames);
                    break;
                }
                case code_gen_types_1.EnumModuleActionType.ChildrenDisconnect: {
                    if (!moduleAction.fieldPermanentId)
                        break;
                    const createMethod = methods?.find((m) => m.name.toLowerCase() === moduleAction.name.toLowerCase());
                    createMethod &&
                        createMethod &&
                        (0, core_1.createRelatedMethodAuthorizeAnnotation)(entity, entities, moduleAction.fieldPermanentId, createMethod, code_gen_types_1.EnumEntityAction.Delete, roleNames);
                    break;
                }
                case code_gen_types_1.EnumModuleActionType.ChildrenFind: {
                    if (!moduleAction.fieldPermanentId)
                        break;
                    const createMethod = methods?.find((m) => m.name.toLowerCase() === moduleAction.name.toLowerCase());
                    createMethod &&
                        createMethod &&
                        (0, core_1.createRelatedMethodAuthorizeAnnotation)(entity, entities, moduleAction.fieldPermanentId, createMethod, code_gen_types_1.EnumEntityAction.Search, roleNames);
                    break;
                }
                case code_gen_types_1.EnumModuleActionType.ChildrenUpdate: {
                    if (!moduleAction.fieldPermanentId)
                        break;
                    const createMethod = methods?.find((m) => m.name.toLowerCase() === moduleAction.name.toLowerCase());
                    createMethod &&
                        createMethod &&
                        (0, core_1.createRelatedMethodAuthorizeAnnotation)(entity, entities, moduleAction.fieldPermanentId, createMethod, code_gen_types_1.EnumEntityAction.Update, roleNames);
                    break;
                }
                case code_gen_types_1.EnumModuleActionType.Custom: {
                    const createMethod = methods?.find((m) => m.name.toLowerCase() === moduleAction.name.toLowerCase());
                    createMethod &&
                        roleNames &&
                        (0, core_1.createMethodAuthorizeAnnotation)(createMethod, roleNames);
                    break;
                }
            }
        }
        return files;
    }
    afterCreateControllerBaseModule(context, eventParams, files) {
        const { controllerBaseModuleBasePath, moduleActionsAndDtos } = eventParams;
        const { roles } = context;
        const roleNames = roles?.map((role) => role.name).join(",");
        const moduleName = moduleActionsAndDtos.moduleContainer.name;
        const pascalPluralName = (0, pascal_case_1.pascalCase)(moduleName);
        const controllerBaseFile = files.get(`${controllerBaseModuleBasePath}/${moduleName}/Base/${pascalPluralName}ControllerBase.cs`);
        if (!controllerBaseFile)
            return files;
        const methods = controllerBaseFile.code.getMethods();
        roleNames &&
            methods?.forEach((method) => {
                (0, core_1.createMethodAuthorizeAnnotation)(method, roleNames);
            });
        return files;
    }
    afterCreateSeedDevelopmentDataFile(context, eventParams, files) {
        const { seedFilePath, resourceName } = eventParams;
        const { entities } = context;
        if (!entities)
            return files;
        const seedFile = files.get(seedFilePath);
        seedFile?.code.addMethod(csharp_ast_1.CsharpSupport.method({
            name: "SeedDevUser",
            access: "public",
            isAsync: true,
            body: (0, core_1.CreateSeedDevelopmentDataBody)(resourceName, context),
            type: csharp_ast_1.MethodType.STATIC,
            parameters: [
                csharp_ast_1.CsharpSupport.parameter({
                    name: "serviceProvider",
                    type: csharp_ast_1.CsharpSupport.Types.reference(csharp_ast_1.CsharpSupport.classReference({
                        name: "IServiceProvider",
                        namespace: `${resourceName}.Infrastructure.Models`,
                    })),
                }),
                csharp_ast_1.CsharpSupport.parameter({
                    name: "configuration",
                    type: csharp_ast_1.CsharpSupport.Types.reference(csharp_ast_1.CsharpSupport.classReference({
                        name: "IConfiguration",
                        namespace: "",
                    })),
                }),
            ],
        }));
        return files;
    }
}
exports["default"] = AuthCorePlugin;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=main.js.map