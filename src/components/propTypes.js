import PropTypes from 'prop-types';

export const todoPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['pending', 'completed']).isRequired,
});

export const todosPropType = PropTypes.arrayOf(todoPropType).isRequired;

export const setTodosPropType = PropTypes.func.isRequired;

export const todoListPropTypes = {
  todos: todosPropType,
  setTodos: setTodosPropType,
};

export const todoDetailPropTypes = {
  todos: todosPropType,
  setTodos: setTodosPropType,
};

export const todoItemPropTypes = {
  todo: todoPropType.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
