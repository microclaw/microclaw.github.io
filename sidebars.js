// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['overview', 'quickstart', 'installation', 'configuration'],
    },
    {
      type: 'category',
      label: 'Usage',
      items: ['usage', 'tools', 'memory', 'scheduler'],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: ['architecture'],
    },
    {
      type: 'category',
      label: 'Developer',
      items: ['developer-guide', 'testing'],
    },
    {
      type: 'category',
      label: 'Reference',
      items: ['project-files', 'license', 'faq', 'roadmap', 'changelog', 'about'],
    },
  ],
};

export default sidebars;
