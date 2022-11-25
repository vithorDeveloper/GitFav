import { gitHubUser } from "./githubUser.js"

// classe com a lógica e estruturação de dados

export class favorites {
  
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
    this.hide()
  }

  hide() {
      if(localStorage.getItem('@github-favorites:') != "[]"){
        this.root.querySelector('.inicio').classList.add('hide')
        this.root.querySelector('table tbody').classList.remove('hide')
      }
      else{
        this.root.querySelector('.inicio').classList.remove('hide')
        this.root.querySelector('table tbody').classList.add('hide')
      }
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    this.hide()
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já cadastrado')
      }


      const user = await gitHubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}


// classe com eventos e vizualização dos dados
export class favoriteView extends favorites{
  constructor(root){
    super(root)

    this.tBody = this.root.querySelector("table tbody")

    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector('.favoritos button')

    addButton.onclick = () => {
      const {value} = this.root.querySelector('.favoritos input')

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach( user =>{

      const row = this.createRow()

      row.querySelector('.td_one img').src = `https://github.com/${user.login}.png`
      row.querySelector('.td_one img').alt = `foto do ${user.name}`
      row.querySelector('.td_one p').textContent = user.name
      row.querySelector('.td_one span').textContent = user.login
      row.querySelector('#repos').textContent = user.public_repos
      row.querySelector('#follows').textContent = user.followers
      row.querySelector('td button').onclick = () =>{
        const isOk = confirm('Deseja mesmo remover essa linha?')

        if(isOk) {
          this.delete(user)
        }
      }

      this.tBody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `<tr class="tr_one">
                    <td class='td_one'>
                      <img src="./images/Ellipse 3.svg" alt="Foto do usuario">
                      <a href="">
                        <p>Mayk_Brito</p>
                        <span>maykbrito_</span>
                      </a>
                    </td>
                    <td id='repos'>75</td>
                    <td id='follows'>398</td>
                    <td><button> Remover</button></td>
                    </tr>`

    return tr
  }

  removeAllTr(){
    const tBody = this.root.querySelector("table tbody")

    tBody.querySelectorAll("tr")
    .forEach((tr) => {
      tr.remove()
    })
  }
}