import Repo from "./Repo";

export interface RepoType {
  id: number;
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  clone_url: string;
  created_at: string;
  description: string | null;
  language: string | null;
}

interface ReposProps {
  repos: RepoType[];
  alwaysFullWidth?: boolean;
}

const Repos = ({ repos, alwaysFullWidth = false }: ReposProps) => {
  const className = alwaysFullWidth ? "w-full" : "lg:w-2/3 w-full";

  return (
    <div className={`${className} bg-glass rounded-lg px-8 py-6`}>
      <ol className="relative border-s border-gray-200">
        {repos.map((repo) => (
          <Repo key={repo.id} repo={repo} />
        ))}
        {repos.length === 0 && (
          <p className="flex items-center justify-center h-32 ">
            No repos found
          </p>
        )}
      </ol>
    </div>
  );
};

export default Repos;
