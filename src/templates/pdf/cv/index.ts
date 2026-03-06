import { type PdfTemplate } from '@/templates/pdf';

export type EmployeeCVPayload = {
  companyName: string;
  firstName: string;
  lastName: string;
  lastNameFirstLetter: string;
  position: string;
  description: string;
  isAnonymized: boolean;
  primarySkills: string[];
  secondarySkills: string[];
  languages: { name: string; level: string }[];
  projects: { period: string; position: string; name: string; description: string }[];
  experience: { from: string; to: string; position: string; company: string; description: string }[];
  education: { from: string; to: string; description: string }[];
};

export type CVLang = {
  personalData: string;
  skillsProfile: string;
  primarySkills: string;
  secondarySkills: string;
  languages: string;
  recentProjects: string;
  experience: string;
  education: string;
  name: string;
  in: string;
  company: string;
};

export const cv = (lang: CVLang) =>
  <PdfTemplate>{
    html: `
  <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CV {{firstName}} {{#if isAnonymized}}{{lastNameFirstLetter}}.{{else}}{{lastName}}{{/if}}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        background-color: #fff;
        color: #333;
        position: relative;
      }

      .container {
        max-width: 100%;
        margin: 10mm 20mm 15px;
      }

      header {
        margin-bottom: 20px;
      }

      h1 {
        font-size: 2em;
        color: #000;
      }

      h2 {
        font-size: 1.5em;
        margin-bottom: 20px;
      }
      
      .btn-logo {
        vertical-align: 5px;
      }

      .personal-data,
      .skills,
      .experience,
      .education {
        margin-bottom: 20px;
      }

      h3 {
        font-size: 1.2em;
        margin-bottom: 10px;
      }

      .skills-columns {
        display: flex;
        justify-content: space-between;
      }

      .skills-columns div {
        flex: 1;
        margin-right: 20px;
      }

      .skills-columns div:last-child {
        margin-right: 0;
      }
      
      .skills-columns ul {
        list-style-type: disc; 
        padding-left: 20px;
      }
      
      ul {
        list-style-type: none;
      }
      
      .experience ul, .education ul {
        list-style: none;
        padding-left: 0;
      }
      .experience ul li, .education ul li {
        display: flex;
        margin-bottom: 20px;
      }

      .years {
        width: 100px;
        flex-shrink: 0;
        margin-right: 20px;
        opacity: 0.8;
      }

      .details {
        margin-bottom: 15px;
        flex-grow: 1;
      }
      
      .details p {
          margin: 0;
          line-height: 1.4;
      }

      .footer-stripes {
        width: 100%;
        height: auto;
      }

      .page-footer {,
        text-align: center;
        position: fixed;
        bottom: 0;
        width: 200px;
        right: 0;
        margin: 0 -13mm -15mm 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <h1 class="btn-logo">{{companyName}}</h1>
        <h2>{{position}}</h2>
      </header>

      <section class="personal-data">
        <h3>${lang.personalData}</h3>
        <p><strong>${lang.name}: {{firstName}} {{#if isAnonymized}}{{lastNameFirstLetter}}.{{else}}{{lastName}}{{/if}}</strong></p>
        <p>{{description}}</p>
      </section>
    
      {{#or primarySkills secondarySkills languages }}
      <section class="skills">
        <h3>${lang.skillsProfile}</h3>
        <div class="skills-columns">
          {{#if primarySkills}}
          <div>
            <h4>${lang.primarySkills}</h4>
            <ul>
              {{#each primarySkills}}
              <li>{{this}}</li>
              {{/each}}
            </ul>
          </div>
          {{/if}}
          {{#if secondarySkills}}
          <div>
            <h4>${lang.secondarySkills}</h4>
            <ul>
              {{#each secondarySkills}}
              <li>{{this}}</li>
              {{/each}}
            </ul>
          </div>
          {{/if}}
          {{#if languages}}
          <div>
            <h4>${lang.languages}</h4>
            <ul>
              {{#each languages}}
              <li>{{name}} - {{level}}</li>
              {{/each}}
            </ul>
          </div>
          {{/if}}
        </div>
      </section>
      {{/or}}
      {{#if projects}}
      <section class="experience">
        <h3>${lang.recentProjects}</h3>
        <ul>
          {{#each projects}}
          <li>
            <div class="years">{{period}}</div>
            <div class="details">
              <p><strong>{{position}} ${lang.in} {{name}}</strong></p>
              {{#if description}}
              <p>{{description}}</p>
              {{/if}}
            </div>
          </li>
          {{/each}}
        </ul>
      </section>
      {{/if}}

      {{#if experience}}
      <section class="experience">
        <h3>${lang.experience}</h3>
        <ul>
          {{#each experience}}
          <li>
            <div class="years">{{from}} - {{to}}</div>
            <div class="details">
              <p><strong>{{position}}</strong></p>
              <p>${lang.company}: {{company}}</p>
              {{#if description}}
              <p>{{description}}</p>
              {{/if}}
            </div>
          </li>
          {{/each}}
        </ul>
      </section>
      {{/if}}

      {{#if education}}
      <section class="education">
        <h3>${lang.education}</h3>
        <ul>
          {{#each education}}
          <li>
            <div class="years">{{from}} - {{#if to}}{{to}}{{else}}present{{/if}}</div>
            <div class="details">
              <p>{{description}}</p>
            </div>
          </li>
          {{/each}}
        </ul>
      </section>
      {{/if}}
    </div>
  </body>
</html>
  `,
  };
