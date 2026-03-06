// @ts-expect-error no types available for handlebars dist
import HandlebarsCompiler from 'handlebars/dist/handlebars';

export type Template = { [key: string]: string };
export type TemplateVariables = { [key: string]: string | number | boolean | string[] | object | object[] };
export type Templates = { [templateName: string]: Template };
export type LanguageTemplates = { [language: string]: Templates };

export type EmailTemplateService = <T>(templateName: string, variables: TemplateVariables) => T;

function registerHelpers() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HandlebarsCompiler.registerHelper('or', function (...args: any[]) {
    const options = args.pop();
    for (let i = 0; i < args.length; i++) {
      const isArray = Array.isArray(args[i]);
      if ((!isArray && args[i]) || args[i].length > 0) {
        // @ts-expect-error ignore type error
        return options.fn(this);
      }
    }

    return options.inverse();
  });
}

export function emailTemplateService(templates: LanguageTemplates, language: string): EmailTemplateService {
  registerHelpers();
  return <T>(templateName: string, variables: TemplateVariables): T => {
    const template = templates[language][templateName];
    if (!template) {
      throw new Error(`Template ${templateName} not found for language ${language}`);
    }

    const result: { [key: keyof Template]: string } = {};
    Object.keys(template).forEach((key: keyof Template) => {
      const compiledTemplate = HandlebarsCompiler.compile(template[key]);
      result[key] = compiledTemplate(variables);
    });

    return <T>result;
  };
}
