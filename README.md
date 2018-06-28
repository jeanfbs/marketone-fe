# upsale-front
UpSale Front-End


### Regras

1. Valor liquido de vendas

2. Modulo financeiro, 
    - relatorio de quanto irá cair na conta para cartões de credito e debito,
    por periodo removendo as taxas dos adquirentes.
    ```
        Exemplo: Vendi 1000 no cartão MASTER card e irei receber 950 sendo 50,00 de taxa
    ```

    - Cadastrar taxas de adquirentes

3. Relatorio de indicadores de estoque por categoria

4. Relatorio de vendas por categoria


Dicas:


Remover a complexidade da tela, de preferencia os usuarios só usam o teclado

Lembrar que no supermecado existem produto de preço, ou seja no codigo de barras
tem o codigo e o preço junto

Lembrar que no supermecado existem balanças.


Cuidado com os uploads de imagens, geralmente os usuarios não gostam de cadastrar produtos
surgiu uma ideia de criar uma base compartilhada de produtos porem cuidado com os seguintes pontos:
 - Um usuario poderá cadastrar um produto falso, com imagem pornografica: por isso se essa for a ideia
 deverá ser criada uma base temporária para avaliar se o produto vai ser adicionado ou nao.
 - Existem produtos cujo codigo é proprietario de cada estabelecimento, como batata, onde cada
   mercado coloca o codigo que quiser, nesse caso os codigos iriam conflitar: para isso sugeresse
   separar esses produtos por categorias especificas de cada supermecado, assim para produtos dessa categoria
   não entraria na base compartilhada
Na busca por produtos geralmente o usuario informa: 2*Arroz Vasconcelos ou 2*015431547(codigo de barras)
então o input de quantidade não pode existir.
Tentar importar os produtos pelo arquivo de nota fiscal do fornecedor. Lembre-se também de usar uma descrição
resumida dos produtos ao gerar o cupom para economizar tinta e papel.





PDV


Todo sistema de PDV precisa manipular uma venda de um produto

Um produto é composto de: Codigo de Barras, Data de Cadastro, Descrição, Preço de custo, Taxa IPI %, %Lucro, Preço de Venda, Quantidade Minimia, 
%Margem de lucro, Marca do produto, Fornecedor, Grupo, Unidade, Quantidade em Estoque, Imagem do produto


Um grupo de produto, seria a categoria do produto, a categoria pode ser: Alimentos, bebidas, Carnes, Chocolates, Diversos, Embutidos, Frios


Cadastro de Empresa, é necessario que o cliente entre com os dados da empresa para gerar nota fiscal

Uma empresa é composta de: CNPJ, Razao SOcial, Nome Fantasia, NR Inscrição Municipal, Inscrição Estadual, email, website, ddd, telefone,
endereço, numero, bairro, cidade, estado, pais



Caixa
Controle de caixa: Tela responsavel por visualizar, criar, remover
configurar um caixa. 

Nas configuracoes de um caixa, o usuario podera adicionar quais os tipos de pagamento
que o caixa aceita: exemplo, caixa 1 so aceita pagamento em dinheiro, caixa 2 dinheiro, cartao

Na Tela dos caixas devera permitir que se consulte todas as movimentacoes que o caixa teve com
base no fechamento especifico, ou seja, selecionara o fechamento do caixa e visualizara os 
detalhes das moviementacoes daquele fechamento.

Assim devera ter uma tela de consulta de fechamento do caixa, filtrando pelo numero do caixa,
responsavel, e periodo. A consulta deve retornar todos os fechamentos correspondentes.

Ao clicar em um fechamento deverá ser visualizado as movimentacoes daquele fechamento com
o codigo da venda para navegar ate os itens da venda.

O caixa possui a seguintes informações:
    ID,
    tipo de pagamento[dinheiro, cartao]
    status,


Fechamento de caixa
    ID do caixa,
    responsavel,
    Saldo inicial da operação
    Totais das Entradas
        Dinheiro
        Cartão de Credito
        Cartão de Debito
    Total das Saidas
        Dinheiro
    Saldo final do caixa em Dinheiro
    Data de abertura,
    Data de Fechamento

Movimentacao de Caixa
    ID do caixa,
    data e horario,
    Totais das Entradas
        Dinheiro
        Cartão de Credito
        Cartão de Debito
    Valor de Saida
    Tipo de Operacao(Venda, Sangria)

O caixa deve possuir o historico dos ultimos fechamentos e quem era o responsavel

O caixa precisa ter um atendente que possa realizar as movimentações de caixa
O caixa possui alguns status: Aberto, Fechado. Só é possivel realizar uma venda com o caixa aberto.
Deve ser possivel imprimir o relatorio das movimentações realizadas até o momento e o atual resumo do caixa
Deve ser posivel imprimir relatorios de fechamentos de outros caixas
A operação de sangria de caixa deve ser associado a um caixa com status em aberto, dessa forma o valor feito pela sangria deverá ser contabilizado no fechamento do caixa.


Movimentações

Para realizar uma moviementação de caixa o caixa precisa estar aberto
Na tela de lançamentos é importante ter:
CODIGO DE BARRAS, Valor Unitario, Total do Item, Lista do cumpom, Subtotal, TOtal recebido, Troco,
CPF da nota fiscal,

Para finalizar uma venda é preciso ter todos os itens da venda do cupom na tela
Precisa permitir que seja possivel dar desconto



Vendas

O fluxo de uma venda se inicia no modulo PDV, o caixa precisa estar aberto e configurado para
um atendente.

O usuario poderá pesquisar uma venda na tela de consulta utilizando os filtros: Data, Valor, Status,
Tipo de Pagamento, Cliente, Desconto, Nr Nota Fiscal, Produtos.

Nessa tela também será possivel realizar um cancelamento de venda com devolução.

Resumo
Relatorios de Vendas Realizadas
Relatorios de Vendas Canceladas
Relatorios de Vendas por Caixa




observacoes importantes
Corrigir o menu superio, para destacar apenas a pagina atual com base na url,
como a chamada dos links esta sendo feita via html tem que ser alterado no root
para ativar o link correto com base na rota quando integrar com o spring.
E remover o setTimeOut.