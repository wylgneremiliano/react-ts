import React, { useState, FormEvent, useEffect } from 'react'
import logoImg from '../../assets/github_explorer.svg'
import { FiChevronRight } from 'react-icons/fi'
import { Title, Form, Repositories, Error } from './styles'
import { Link } from 'react-router-dom'
import api from '../../services/api'

interface Repository {
  full_name: string
  description: string
  owner: {
    login: string
    avatar_url: string
  }
}
const Dashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@GithubExplore:repositories')
    if (storagedRepositories) {
      return JSON.parse(storagedRepositories)
    } else {
      return []
    }
  })
  const [newRepo, setNewRepo] = useState('')
  const [inputError, setInputError] = useState('')
  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    console.log(newRepo)
    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório')
      return;
    }
    try {
      const response = await api.get<Repository>(`repos/${newRepo}`)
      const repository = response.data
      setRepositories([...repositories, repository])
      setNewRepo('')
    } catch (error) {
      setInputError('Digite um repósitorio existente')
    }

  }
  useEffect(() => {
    localStorage.setItem('@GithubExplore:repositories', JSON.stringify(repositories))
  }, [repositories])
  return (
    <>
      <img src={logoImg} alt="GitHub Explore" />
      <Title>Explore Repositórios no Github</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError &&
        <Error>{inputError}</Error>
      }
      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.full_name} to={`repositories/${repository.full_name}`}>
            <img src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  )

}

export default Dashboard