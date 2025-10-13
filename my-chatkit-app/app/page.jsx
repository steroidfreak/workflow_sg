'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const checklist = [
  {
    label: 'Agent roster',
    description:
      'Review the connected Workflow SG agents and their capabilities before launching a conversation.',
  },
  {
    label: 'Knowledge packs',
    description: 'Load the reference knowledge packs that agents can cite during the session.',
  },
  {
    label: 'Workspace link',
    description: 'Invite your teammates by sharing chatkit.workflow.sg to collaborate in real time.',
  },
];

export default function Home() {
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const router = useRouter();

  const handleLauncherClick = () => {
    setWorkspaceReady(true);
    router.push('/usecaselauncher');
  };

  return (
    <main>
      <h1>Chatkit Conversation Hub</h1>
      <p>
        Spin up a focused command center to orchestrate Workflow SG agents, share findings with your team, and keep track
        of every decision made along the way.
      </p>

      <ul>
        {checklist.map((item) => (
          <li key={item.label}>
            <span>{item.label}</span>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>

      <button
        id="usecaselauncher"
        data-usecaselauncher
        data-launch-href="/usecaselauncher"
        type="button"
        onClick={handleLauncherClick}
      >
        {workspaceReady ? 'Re-open Use Case Launcher' : 'Open Use Case Launcher'}
      </button>

      {workspaceReady && (
        <p style={{ marginTop: '1.5rem' }}>
          Great! You can now access the live deployment at{' '}
          <a className="a-button" href="https://chatkit.workflow.sg" rel="noreferrer" target="_blank">
            chatkit.workflow.sg
          </a>
        </p>
      )}
    </main>
  );
}
