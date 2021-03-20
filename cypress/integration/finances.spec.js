//const { Context } = require("mocha")

///<reference types="cypress" />

import {format,prepareLocalStorage} from '../support/utils'

// cy.viewport

context('Dev Finances Agilizei',()=>{

    beforeEach(()=>{
        
        cy.visit('https://devfinance-agilizei.netlify.app/',{
            onBeforeLoad:(win)=>{



            }
        })





    })

    it('Cadastrar entradas',()=>{



        cy.get('#transaction .button').click() 
        cy.get('#description').type('Presente')
        cy.get('[name=amount]').type(12)
        cy.get('[type=date]').type('2021-03-21')
        cy.get('button').contains('Salvar').click()

        cy.get('#data-table tbody tr').should('have.length',1)

    });

    it('Cadastrar saidas',()=>{

       

        cy.get('#transaction .button').click() 
        cy.get('#description').type('Presente')
        cy.get('[name=amount]').type(-12)
        cy.get('[type=date]').type('2021-03-21')
        cy.get('button').contains('Salvar').click()

        cy.get('#data-table tbody tr').should('have.length',1)
    });

    it('Remover entradas e saidas',()=>{
        
        const entrada = 'Mesada'
        const saida = 'KinderOvo'

        //cadastrar dado de entrada
        cy.get('#transaction .button').click() 
        cy.get('#description').type(entrada)
        cy.get('[name=amount]').type(100)
        cy.get('[type=date]').type('2021-03-21')
        cy.get('button').contains('Salvar').click()

        //cadastrar dado de saida
        cy.get('#transaction .button').click() 
        cy.get('#description').type(saida)
        cy.get('[name=amount]').type(-35)
        cy.get('[type=date]').type('2021-03-21')
        cy.get('button').contains('Salvar').click()

        
            //capturar o texto do total
            //comparar o somatorio de entradas e despesas com o total

            //estrategia 1, voltar para o elemento pai e avançar para um td img
            cy.get('td.description')
            .contains(entrada)
            .parent()
            .find('img[onclick*=remove]')
            .click()    

            //estrategia 2: buscar todos os irmaos e buscar img

            cy.get('td.description')
            .contains(saida)
            .siblings()
            .children('img[onclick*=remove]')
            .click()
        
        cy.get('#data-table tbody tr').should('have.length',0)
        
        })

  

        it('Validar saldo com diversas transações',()=>{
          

            cy.get('#transaction .button').click() 
            cy.get('#description').type("Mesada")
            cy.get('[name=amount]').type(100)
            cy.get('[type=date]').type('2021-03-21')
            cy.get('button').contains('Salvar').click()

            cy.get('#transaction .button').click() 
            cy.get('#description').type('Suco Kapo')
            cy.get('[name=amount]').type(-35)
            cy.get('[type=date]').type('2021-03-21')
            cy.get('button').contains('Salvar').click()
                
            let incomes=0
            let expenses=0
            

            cy.get('#data-table tbody tr')
            .each(($el, index, $list)=>{
                cy.get($el).find('td.income,td.expense').invoke('text').then(text=>{

                    if(text.includes('-')){
                        expenses=expenses+format(text)
                    }else{
                        incomes=incomes+format(text)
                    }

                    cy.log(`entradas`,incomes)
                    cy.log(`saidas`,expenses)
                })

            })

            cy.get('#totalDisplay').invoke('text').then(text=>{
            
                let formattedTotalDisplay=format(text)
                let expectedTotal=incomes+expenses

                expect(formattedTotalDisplay).to.eq(expectedTotal)

            })
        });


    });





