from api.simulator.utils import create_func_str, get_func_from_str


def test_create_func_str_and_get_func_from_str():
    # Arrange
    odes = ['d0dt = -0.5 * y[0]', 'd1dt = 0.5 * y[0] - 0.1 * y[1]']

    # Act
    func_str = create_func_str(odes)
    func = get_func_from_str(func_str)

    # Assert
    y = [1.0, 0.0]
    t = 0.0
    result = func(y, t)
    # d0dt = -0.5 * 1.0 = -0.5
    # d1dt = 0.5 * 1.0 - 0.1 * 0.0 = 0.5
    assert result == (-0.5, 0.5)
