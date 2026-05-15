import { Heading, CodeBlock, Callout, InlineCode, PageTitle } from '../Prose';

export const authToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'getting-a-key', label: 'Getting a key' },
  { id: 'using-the-key', label: 'Using the key' },
  { id: 'rotation', label: 'Key rotation' },
  { id: 'scopes', label: 'Scopes' }
];

export default function AuthPage() {
  return (
    <>
      <PageTitle
        eyebrow='API'
        title='Authentication'
        lede='FRED uses bearer-token authentication. API keys are scoped per environment and per use case. This page explains how to obtain a key, send authenticated requests, and rotate keys safely.'
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        Every API call must include an{' '}
        <InlineCode>Authorization</InlineCode> header with a bearer token. The
        token format is opaque: do not try to parse it. Keys are issued from
        the FRED admin console.
      </p>

      <Heading id='getting-a-key' level={2}>
        Getting a key
      </Heading>
      <p>
        While FRED is in beta, keys are provisioned manually. Email{' '}
        <a href='mailto:frredss@ucdavis.edu'>frredss@ucdavis.edu</a> with:
      </p>
      <ul>
        <li>Your name, affiliation, and intended use case</li>
        <li>Expected query volume (per day)</li>
        <li>Whether you need write access (uncommon; rare for research use)</li>
      </ul>
      <p>
        Researchers and California-based biomass operators typically get
        approved within 24 hours. Commercial users may take longer pending
        UC Davis policy review.
      </p>

      <Heading id='using-the-key' level={2}>
        Using the key
      </Heading>
      <p>
        Include the key in the{' '}
        <InlineCode>Authorization</InlineCode> header of every request:
      </p>
      <CodeBlock
        lang='bash'
        code={`curl -X POST https://api.biofred.us/agent \\
  -H "Authorization: Bearer fred_live_a1b2c3d4..." \\
  -H "Content-Type: application/json" \\
  -d '{"query": "your query here"}'`}
      />

      <Callout kind='danger'>
        Never commit API keys to source control. Use environment variables
        and a secrets manager. Keys are revocable but leaked keys can incur
        significant cost before revocation.
      </Callout>

      <Heading id='rotation' level={2}>
        Key rotation
      </Heading>
      <p>
        Rotate keys quarterly at minimum, or whenever a key may have been
        exposed (committed to git, sent in an email, posted in chat). The
        rotation procedure:
      </p>
      <ol>
        <li>Request a new key from the admin console.</li>
        <li>Deploy the new key to all consumers.</li>
        <li>Wait 24 hours for stragglers.</li>
        <li>Revoke the old key.</li>
      </ol>

      <Heading id='scopes' level={2}>
        Scopes
      </Heading>
      <p>Keys can be issued with one of three scope sets:</p>
      <ul>
        <li>
          <strong>read</strong>: agent endpoint, all tool endpoints, all
          trace and admin read endpoints. The default for research and
          analyst keys.
        </li>
        <li>
          <strong>read+write</strong>: includes the ability to write session
          state and submit feedback. Required for the chat interface.
        </li>
        <li>
          <strong>admin</strong>: includes cache flush, model reload, and
          user provisioning. Reserved for FRED operators.
        </li>
      </ul>
    </>
  );
}
